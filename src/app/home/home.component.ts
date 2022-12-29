import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { map } from 'rxjs';
import { PhotoService } from './data-access/photo.service';
import { PhotoListComponentModule } from "./ui/photo-list.component";

@Component({
  selector: 'app-home',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Snapaday</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="photoService.takePhoto()">
            <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <app-photo-list
        *ngIf="photos$ | async as photos"
        [photos]="photos"
      ></app-photo-list>
    </ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  photos$ = this.photoService.photos$.pipe(
    map((photos) =>
    photos.map((photo) => ({
      ...photo,
      safeResourceURL: this.sanitizer.bypassSecurityTrustResourceUrl(
        photo.path
      ),
    })),
    )
  );

  constructor(
    protected photoService: PhotoService,
    private sanitizer: DomSanitizer
  ) {}
}

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
            },
        ]),
        PhotoListComponentModule
    ]
})
export class HomeComponentModule {}
