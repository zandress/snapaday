import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Photo } from "src/app/shared/interfaces/photo";

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    #photos$ = new BehaviorSubject<Photo[]>([]);
    photos$ = this.#photos$.asObservable();

    private addPhoto(fileName: string, filePath: string) {
        const newPhotos = [
            {
                name: fileName,
                path: filePath,
                dateTaken: new Date().toISOString(),
            },
            ...this.#photos$.value,
        ];

        this.#photos$.next(newPhotos);
    }
}