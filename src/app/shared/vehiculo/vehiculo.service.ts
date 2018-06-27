import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';
import { FacturarDialogComponent } from '../../dialogs/facturar/facturar.dialog.component';
import { Factura } from '../../modelos/factura';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Vehiculos} from '../../modelos/vehiculos';
import { HttpClient,  HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class VehiculoService {
  public API = '//localhost:8080'
  public VEHICULO_API=this.API+'/vehiculo'
  public FACTURA_API =this.API+'/factura' 
  private readonly API_URL = '//localhost:8080/vehiculos';

  dataChange: BehaviorSubject<Vehiculos[]> = new BehaviorSubject<Vehiculos[]>([]);
  TRM: String;
  // Temporarily stores data from dialogs
  dialogData: any;
  Data: any;
  factura: Factura;
  vehiculos : Vehiculos[];
  facturaChange: BehaviorSubject<Factura[]> = new BehaviorSubject<Factura[]>([]);
  constructor (private httpClient: HttpClient, public facturaDialog: MatDialog) {}

  get data(): Vehiculos[] {
    return this.dataChange.value;
  }
   
  getDialogData() {
    return this.dialogData;
  }

    getAllVehiculos() {
    return this.httpClient.get(this.API_URL);

  }

  addVehiculo (vehiculo: Vehiculos): void {
    this.Data = vehiculo;
    this.httpClient.post(this.VEHICULO_API, this.Data).subscribe(data => {
      this.dialogData = vehiculo;
      },
      (err: HttpErrorResponse) => {
          alert(err.error.message)
    });

  }
    
  getTRM (): String {
    this.httpClient.get(this.API+'/TRM').subscribe((data:String) => {
      this.TRM = data;
        alert("TRM del dia: "+this.TRM);
        return this.TRM;
      },
      (err: HttpErrorResponse) => {
    });
      return this.TRM;
  }

  updateVehiculo (vehiculo: Vehiculos): void {
    this.Data = {"placa": vehiculo.placa, "tipoVehiculo": vehiculo.TipoVehiculo, "cilindraje": vehiculo.cilindraje}
    this.httpClient.put(this.VEHICULO_API+"/"+vehiculo.placa, this.Data).subscribe(data => {
      this.dialogData = vehiculo;
      },
      (err: HttpErrorResponse) => {
    });
  }

    deleteVehiculo (placa: string): Factura {
    this.httpClient.delete(this.VEHICULO_API+"/"+placa).subscribe((data: Factura) => { 
            this.factura = data; 
     },
      (err: HttpErrorResponse) => {
    });
      return this.factura;
  }

  getAll(): Observable<any> {
    return this.httpClient.get(this.VEHICULO_API+'s');
   }

   get(placa: string){
   	return this.httpClient.get(this.VEHICULO_API+'/'+placa)
   }

   save(vehiculo: any): Observable<any>{
    let result: Observable<Object>;
  	if (vehiculo['href']) {
        	result = this.httpClient.put(vehiculo.href, vehiculo);
      	} else {
        	result = this.httpClient.post(this.VEHICULO_API, vehiculo);
      	}
      	return result;	
    }

   remove(href: string){
   	return this.httpClient.delete(href);
   }
 }
