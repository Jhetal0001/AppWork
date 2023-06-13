import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, or, query, setDoc, where } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { Task, TaskList, TaskX } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private taskListSubject = new Subject<TaskList>();
  taskList$ = this.taskListSubject.asObservable();

  private taskListAllSubject = new Subject<TaskList>();
  taskListAll$ = this.taskListAllSubject.asObservable();

  constructor(private fb: Firestore) { }

  saveTask(task: Task) {
    return addDoc(collection(this.fb, 'app-work', 'task', 'newTask'), task)
  }

  finallyTask(task: Task, id: string) {
    return setDoc(doc(this.fb, 'app-work', 'task', 'newTask', id), task)
  }

  deleteTask(id: string) {
    return deleteDoc(doc(this.fb, 'app-work', 'task', 'newTask', id))
  }

  getTaskList(id: string) {
    const q = query(collection(this.fb, 'app-work', 'task', 'newTask'), or(where('id_autor', '==', id), where("id_collaborators", "array-contains", id)));
    let taskList: TaskList = [];

    return onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          taskList.push({ id: change.doc.id, task: (change.doc.data() as Task) });
        }
        if (change.type === "modified") {
          taskList = taskList.map((task: TaskX) => {
            if(task.id === change.doc.id) {
              return { id: change.doc.id, task: (change.doc.data() as Task) } as TaskX
            }
            return task;
          });
        }
        if (change.type === "removed") {
          taskList = taskList.filter(task => task.id !== change.doc.id)
        }
      });
      this.taskListSubject.next(taskList);
    });


  }

  getTaskListAll() {
    const q = query(collection(this.fb, 'app-work', 'task', 'newTask'), where('finally', '==', true));
    return getDocs(q);

  }

}
