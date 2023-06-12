import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './utils.html',
})
export class UtilsComponent {


  isSyncAnimated = true;
  magicLevel!:any;
  notification: number = 0;

  input(event: any) {
    this.magicLevel = (event.target as HTMLInputElement).value
  }

  onClick(){
    this.notification++
  }

  @ViewChild('host', { static: true, read: ViewContainerRef })
  container!: ViewContainerRef;

  createIcon() {
    const componentRef = this.container.createComponent(FaIconComponent);
    componentRef.instance.icon = faUser;
    // Note that FaIconComponent.render() should be called to update the
    // rendered SVG after setting/updating component inputs.
    componentRef.instance.render();
  }

}
