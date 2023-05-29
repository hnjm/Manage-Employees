import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  uploadeFile(file: any)
  {
   return this.http.post('https://localhost:7081/file/upload', file);
 }

 downloadeFile(fileName: any)
 {
  return this.http.get('https://localhost:7081/file/upload/'+fileName);
}

}
