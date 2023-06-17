import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Chart, ChartOptions, elements } from 'chart.js/auto';
import { HourChart, Task, TaskList, TaskX, UserTask } from 'src/app/models/task.model';
import { UsersList } from 'src/app/models/user.model';
import { TaskService } from 'src/app/services/task.service';
import { UsersService } from 'src/app/services/users.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gestionar',
  templateUrl: './gestionar.component.html',
  styleUrls: ['./gestionar.component.scss'],
  animations: [
    trigger('init', [
      state('void', style({opacity: 0})),
      transition('void <-> *', [
        animate('300ms', style({opacity: 1}))
      ])
    ])
  ]
})
export class GestionarComponent implements OnInit{

  horas = [1,2,3,4,5,6,7,8,9]
  newTask!: FormGroup;
  isValidForm = false;
  mesChart: any;
  semGroupChart: any;
  user!: string;
  listUsers: Array<UsersList>;
  listUsersAdd: Array<UsersList> = [];
  listaFiltrada: any;
  filtro: string = '';
  bgColors = ['bg-primary', 'bg-success', 'bg-info', 'bg-danger', 'bg-warning'];
  tipe_activities = ["Apoyo Equipo","Autoestudio","Capacitación","Corrección Inconsistencias","Qtalk","Reunión Analista Requisitos","Reunión Calidad","Reunión Líder","Socialización"];
  listTask: TaskList = [];
  listTaskOpened: TaskList = [];
  listTaskClosed: TaskList = [];
  listTaskCompart: TaskList = [];
  listTaskReq: TaskList = [];
  hoursMont!: HourChart ;
  usersMontAll: any = [];
  chartMont: number[] = [];
  chartMontAll: number[] = [];
  startDate: string =  new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().substring(0, 10);
  endDate: string = new Date().toISOString().substring(0, 10);

  constructor(private formBuilder: FormBuilder, private usersService: UsersService, private taskService: TaskService, private formatter: NgbDateParserFormatter, private UTIL: UtilsService){
    this.newTask = this.formBuilder.group({
      date: ['', (Validators.required)],
      tipo_actividad: ['', (Validators.required)],
      actividad: ['', (Validators.required)],
      horas: ['', (Validators.required)],
      req: ['']
    });
    this.listUsers = this.usersService.users$;
    this.listaFiltrada = this.listUsers;
  }

  handleDateRangeSelected(dateRange: { fromDate: NgbDate | null, toDate: NgbDate | null }){
    this.startDate = this.formatter.format(dateRange.fromDate);
    this.endDate = this.formatter.format(dateRange.toDate);
    this.filterByDate()
  }

  saveTask() {
    if(this.newTask.valid) {
      const saveTask: Task = {
        activity: this.newTask.get('actividad')?.value,
        date: this.newTask.get('date')?.value,
        finally: false,
        hour: this.newTask.get('horas')?.value,
        id_autor: this.user,
        id_collaborators: this.listUsersAdd.map(user => user.id),
        title: this.newTask.get('tipo_actividad')?.value,
        req: this.newTask.get('req')?.value
      }
      this.taskService.saveTask(saveTask).then(() => {this.UTIL.showAlert('se agrego correctamente la tarea', 'success')}).catch(error => this.UTIL.showAlert(error.message, 'danger'));
      this.newTask.reset();
      this.isValidForm = false;
    } else {
      this.isValidForm = true;
    }
  }

  isUserExcluded(userId: string): boolean {
    return !this.listUsersAdd || !this.listUsersAdd.some(u => u.id === userId);
  }

  aplicarFiltro() {
    // Aplicar el filtro a la lista original y actualizar la lista filtrada
    this.listaFiltrada = this.listUsers.filter(item => {
      // Aquí defines la lógica del filtro
      // Por ejemplo, si deseas filtrar por nombre
      return item.name.toLowerCase().includes(this.filtro.toLowerCase());
    });
  }

  addUser(user: UsersList) {
      this.listUsersAdd.push(user);
  }

  removeUser(user: UsersList) {
    const index = this.listUsersAdd.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.listUsersAdd.splice(index, 1);
    }
  }

  gestionTask(listTask: TaskList) {
    this.listTask = listTask;
    this.listTaskOpened = listTask.filter(task => !task.task.finally && task.task.id_autor === this.user && !task.task.req)
    this.listTaskClosed = listTask.filter(task => task.task.finally && task.task.id_autor === this.user && !task.task.req)
    this.listTaskCompart = listTask.filter(task => task.task.id_autor !== this.user)
    this.listTaskReq = listTask.filter(task => task.task.req)
    const currentMonth = new Date().getMonth();
    this.hoursMont = {
      finallys: this.listTaskClosed
        .filter(task => new Date(task.task.date).getMonth() === currentMonth) // Filtrar por mes
        .reduce((total, task) => total + task.task.hour, 0), // Sumar las horas

      opens: this.listTaskOpened
        .filter(task => new Date(task.task.date).getMonth() === currentMonth) // Filtrar por mes
        .reduce((total, task) => total + task.task.hour, 0), // Sumar las horas

      missing: 189 - this.listTaskClosed
        .filter(task => new Date(task.task.date).getMonth() === currentMonth) // Filtrar por mes
        .reduce((total, task) => total + task.task.hour, 0) - this.listTaskOpened
        .filter(task => new Date(task.task.date).getMonth() === currentMonth) // Filtrar por mes
        .reduce((total, task) => total + task.task.hour, 0) // Sumar las horas restantes
    };
  }

  gestionTaskAll(listTask: TaskList) {

    const userTasks: any = [];
    this.listUsers.map(user => {
      listTask.forEach((task) => {
        if(task.task.id_autor === user.id || task.task.id_collaborators?.includes(user.id)){
          userTasks.push({user: user , task: task.task});
        }
      })
    })
    const userSummary: { userName: string, id_user: string, totalHours: number }[] = [];
    userTasks.forEach((task: any) => {
      const existingUser = userSummary.find((user) => user.id_user === task.user.id);

      if (existingUser) {
        existingUser.totalHours += task.task.hour;
      } else {
        userSummary.push({ userName: task.user.name, id_user: task.user.id, totalHours: task.task.hour });
      }
    });
    userSummary.forEach((userTask, index) => {
      this.usersMontAll.push({
        animation: {
          delay: index*200,
        },
        label: userTask.userName.slice(0, 5),
        borderRadius: 5,
        data: [userTask.totalHours],
      })
    });
  }

  finallyTask(task: Task, id: string) {
    task.finally = true;
    const date = task.date as Date;
    task.date = date.toISOString().substring(0, 10);
    this.taskService.finallyTask(task, id).then(() => this.UTIL.showAlert('Se Finalizo la tarea', 'info')).catch(error => this.UTIL.showAlert(error.message, 'danger'));
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id).then(() => this.UTIL.showAlert('Se elimino la tarea', 'warning')).catch(error => this.UTIL.showAlert(error.message, 'danger'));
  }

  filterTasksByDate(tasks: TaskList) {
    if (this.startDate && this.endDate) {
      return tasks.filter((task) => {
        return moment(task.task.date).isBetween(this.startDate, this.endDate, 'day', '[]');
      });
    } else {
      return tasks;
    }
  }

  getTotalHours(tasks: TaskList): number {
    return tasks.reduce((total, task) => total + task.task.hour, 0);
  }

  filterByDate(): void {
    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      this.startDate = this.endDate;
    }
    this.charts();
  }

  charts() {

    const filteredOpenedTasks = this.filterTasksByDate(this.listTaskOpened);
    const filteredClosedTasks = this.filterTasksByDate(this.listTaskClosed);
    const filteredCompTasks = this.filterTasksByDate(this.listTaskCompart);
    const filteredReqTask = this.filterTasksByDate(this.listTaskReq);

    const totalOpenedHours = this.getTotalHours(filteredOpenedTasks);
    const totalClosedHours = this.getTotalHours(filteredClosedTasks);
    const totalCompHours = this.getTotalHours(filteredCompTasks);
    const totalReqHours = this.getTotalHours(filteredReqTask);

    if (this.mesChart || this.semGroupChart) {
      // Si la instancia del gráfico ya existe, destrúyela antes de crear una nueva
      this.mesChart.destroy();
      this.semGroupChart.destroy();
    }
    this.mesChart = new Chart('mesChart', {
      type: 'pie',
      data: {
        labels: [
          'Finalizadas',
          'Abiertas',
          'Requisitos',
          'Faltantes'
        ],
        datasets: [{
          label: 'Horas',
          hoverBackgroundColor: ['#00d10aa1', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)', 'rgba(201, 203, 207, .8)'],
          data: [
            totalClosedHours + totalCompHours,
            totalOpenedHours,
            totalReqHours,
            189 - (totalClosedHours + totalCompHours + totalReqHours + totalOpenedHours)
          ],
          backgroundColor: [
            '#00d10a5d',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(201, 203, 207, 0.3)' ,
          ],
          borderColor: [
            '#00d30b',
            'rgb(255, 99, 132)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)' ,
          ]
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true,
            },
          },
          tooltip: {
            usePointStyle: true,
          },
          title: {
            display: true,
            text: 'Analisis Horas - 189/mes',
            color: '#25f',
            font: {
              size: 20,
              lineHeight: 1.2
            },
          }
        }
      }
    });
    this.semGroupChart = new Chart('semGroupChart', {
      type: 'bar',
      data: {
        labels: ['Month'],
        datasets: this.usersMontAll
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            suggestedMin: 189,
            suggestedMax: 190,
            ticks: {
              stepSize: 10,
            },
          }
        },
        interaction: {
          mode: 'index',
        },
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
          title: {
            display: true,
            text: 'Mes Group',
            color: '#25f',
            font: {
              size: 20,
              lineHeight: 1.2
            },
          },
          tooltip: {
            usePointStyle: true,
          }
        }
      }
    });

  }

  ngOnInit(): void {
    this.usersService.user$.subscribe(data => {
      if (data) {
        this.user = data.uid;
        this.taskService.getTaskList(this.user);
      }
    })
    this.taskService.taskList$.subscribe(taskList => {
      if(taskList) {
        const taskDatePaser = taskList.map(task => {
          task.task.date = moment(task.task.date).toDate();
          return task;
        })
        taskDatePaser.sort((a, b) => {
          const fechaA = a.task.date as Date;
          const fechaB = b.task.date as Date;
          return fechaB.getTime() - fechaA.getTime();
        });
        this.gestionTask(taskDatePaser);
        this.chartMont = [this.hoursMont.finallys,this.hoursMont.opens,this.hoursMont.missing]
        this.charts()
      }
    })
    this.taskService.getTaskListAll().then(taskListAll => {
      if(taskListAll) {
        const taskListAllArray: TaskList = [];
        taskListAll.forEach(data => {
          const taskID = data.id;
          const task: TaskX = {id: taskID, task: (data.data() as Task)}
          taskListAllArray.push(task as TaskX)
        })
        const taskDatePaser = taskListAllArray.map(task => {
          task.task.date = moment(task.task.date).toDate();
          return task;
        })
        taskDatePaser.sort((a, b) => {
          const fechaA = a.task.date as Date;
          const fechaB = b.task.date as Date;
          return fechaB.getTime() - fechaA.getTime();
        });
        console.log(taskDatePaser)
        this.gestionTaskAll(taskDatePaser);
      }
    })
  }
}
