import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface infoAlert {
  message: string;
  type: string;
}

@Component({
  selector: 'app-alerts',
  styleUrls: ['./alerts.component.scss'],
  templateUrl: `./alerts.component.html`,
  animations: [
    trigger('fadeInOut', [
      state('void',
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        })),
      transition('void <=> *', animate(300)),
    ]),
  ],
})

export class AlertsComponent implements OnInit {


  @ViewChild('alert', { static: true }) miDivRef!: ElementRef;
  alert$ = this.utilsService.alert$;
  infoAlert!: infoAlert;

  constructor(private utilsService: UtilsService) {}

  agregarHTML() {
    if (this.miDivRef) {
      const miDiv = this.miDivRef.nativeElement;
      const contenidoHTML = `
        <div class="alert-ico"><i class="fa-solid fa-circle-info"></i></div>
        <span>Hola este es Mi nuevo Alert</span>
        `;
      miDiv.innerHTML = contenidoHTML;
    }
  }

  clearAlert(){
    this.utilsService.clearAlert();
  }

  ngOnInit() {
    this.alert$.subscribe((alert) => {
      if (alert) {
        this.infoAlert = alert;
        setTimeout(() => {
          this.utilsService.clearAlert();
        }, 5000);
      }
    });
  }

}
