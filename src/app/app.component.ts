import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {VehiculoService} from './shared/vehiculo/vehiculo.service';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort, MatDialogConfig} from '@angular/material';
import {Vehiculos} from './modelos/vehiculos';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk/collections';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {AddDialogComponent} from './dialogs/add/add.dialog.component';
import {EditDialogComponent} from './dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {FacturarDialogComponent} from './dialogs/facturar/facturar.dialog.component';
import {Factura} from './modelos/factura';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  displayedColumns = ["Placa", "Tipo", "FechaIngreso", 'actions'];

  id: number;
  placa: string;
  facturaDialog: MatDialog;
  factura : Factura;
  TRM: String;
  vehiculos : Vehiculos[];

 
  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: VehiculoService) {}

    ngOnInit() {
    this.loadData();
    this.TRM = this.dataService.getTRM();
  }
  
    refresh() {
    this.loadData();
  }
  
    addNew(vehiculo: Vehiculos) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {vehiculo: vehiculo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log(this.dataService.getDialogData());
        this.dataService.addVehiculo(this.dataService.getDialogData());
        this.refresh();
      }
    });
  }
  
   startEdit(placa: string, tipoVehiculo: string, FechaIngreso: string) {
    this.placa = placa;
    console.log(this.placa);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {palca: placa, tipoVehiculo: tipoVehiculo, FechaIngreso: FechaIngreso}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log(this.dataService.getDialogData());
        this.dataService.updateVehiculo(this.dataService.getDialogData());
        this.refresh();
      }
    });
  }
  
    deleteItem(placa: string, tipoVehiculo: string, FechaIngreso: string) {
    this.placa = placa;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {placa: placa, tipoVehiculo: tipoVehiculo, FechaIngreso: FechaIngreso}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.factura = this.dataService.deleteVehiculo(this.dataService.getDialogData());
        console.log("Factura: "+ this.factura.fechaEntrada);
        this.mostrarFactura(this.factura);
        this.refresh();
      }
     });
    }
 
    mostrarFactura(factura:Factura): any {
      console.log(this.factura);
     const dialogRef = this.dialog.open(FacturarDialogComponent, {
       data: {placa: this.factura.placa, fechaEntrada: this.factura.fechaEntrada, fechaSalida: this.factura.fechaSalida,
          totalHoras: this.factura.totalHoras, totalPagar: this.factura.totalPagar}
      } );
          dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
      }
    });
  }
  
    public loadData() {
       this.vehiculos = this.dataService.getAllVehiculos().subscribe((data: Vehiculos[]) =>  this.vehiculos = data);;
        console.log("Vehiculos: " + this.vehiculos);
  }
}

