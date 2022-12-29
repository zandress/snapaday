import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Photo } from "src/app/shared/interfaces/photo";

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    #photos$ = new BehaviorSubject<Photo[]>([]);
    photos$ = this.#photos$.asObservable();
}