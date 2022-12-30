import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { combineLatest, map } from 'rxjs';
import { PhotoService } from './data-access/photo.service';
import { PhotoListComponentModule } from './ui/photo-list.component';

@Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ion-header>
        <ion-toolbar color="danger">
          <ion-title>Snapaday</ion-title>
          <ion-buttons slot="end">
            <ion-button
              (click)="photoService.takePhoto()"
              [disabled]="vm.hasTakenPhotoToday === true"
            >
              <ion-icon name="camera-outline" slot="icon-only"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <app-photo-list [photos]="vm.photos"></app-photo-list>
      </ion-content>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  photos$ = this.photoService.photos$.pipe(
    map((photos) =>
      photos.map((photo) => ({
        ...photo,
        safeResourceUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
          photo.path
        ),
      }))
    )
  );

  vm$ = combineLatest([
    this.photos$,
    this.photoService.hasTakenPhotoToday$,
  ]).pipe(
    map(([photos, hasTakenPhotoToday]) => ({
      photos,
      hasTakenPhotoToday,
    }))
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
    PhotoListComponentModule,
  ],
})
export class HomeComponentModule {}
