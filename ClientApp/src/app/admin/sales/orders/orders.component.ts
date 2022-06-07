import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/_directives/sortable.directive';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
// import { Router } from '@angular/router';
import { Orders } from 'src/app/_models/Orders';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/_services/toastservice';
import { OrdersService } from 'src/app/_services/orders.service';
import { delay, map } from 'rxjs/operators';
import { Location } from 'src/app/_models/Location';
import { NgbdDatepickerRangePopup } from 'src/app/datepicker-range/datepicker-range-popup';
import { ExcelService } from 'src/ExportExcel/excel.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerOrders, OrderCheckout, OrderDetails } from 'src/app/_models/Orders';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from './modal-content/ngbd-modal-content.component';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  
  providers: [ExcelService]
})

export class OrdersComponent implements OnInit {
  public orderDetails = new OrderDetails();
  public orderOrderCheckout = new OrderCheckout();
  public orderCustomerInfo = new CustomerOrders();
  
  data$: Observable<Orders[]>;
  oldData: Orders[];
  total$: Observable<number>;
  loading$: Observable<boolean>;
  private selectedBrand;
  private selectedLocation;
  Locations: Location[] = [];
  selectedLocations = [];
  locationID = 0;

  closeResult = '';

  @ViewChild(NgbdDatepickerRangePopup, { static: true }) _datepicker;
  
  locationSubscription: Subscription;
  submit: boolean;
  salesorders: Orders[] = [];

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  @ViewChild('locationDrp') drplocation: any;
  constructor(public service: OrdersService,private modalService: NgbModal,
    public ls: LocalStorageService,
    public excelService: ExcelService,
    public ts: ToastService,
    
    public router: Router,
    private route: ActivatedRoute) {
    this.loading$ = service.loading$;
    this.submit = false;
    
    this.selectedBrand = this.ls.getSelectedBrand().brandID;
    this.loadLocations();
  }

  open(orders) 
  {    
    debugger        
   
    
    this.service.getById(orders, this.selectedBrand).subscribe(res => {          
      console.log(res);
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.dataObj = res;
      
    });        
  }

  ngOnInit() {
 
  }
 
 
  getData(locaionID) {
     
    this.service.getAllData(this.selectedBrand, locaionID, this.parseDate(this._datepicker.fromDate), this.parseDate(this._datepicker.toDate));
    this.data$ = this.service.data$;
    this.total$ = this.service.total$;
    this.loading$ = this.service.loading$;
  }

  onSort({ column, direction }: SortEvent) {

    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  View(orders) {
    debugger
    this.router.navigate(["admin/orders/view", orders]);
  }
  Print(sid) {
    this.service.printorder(sid, this.selectedBrand).subscribe((res: any) => {
      //Set Forms
      
      if (res.status == 1) {
        this.printout(res.html);
      }
      else
        this.ts.showError("Error", "Failed to print.")
    });
  }
  parseDate(obj) {
    return obj.year + "-" + obj.month + "-" + obj.day;;
  }

  loadLocations() {
    this.service.loadLocations(this.selectedBrand).subscribe((res: any) => {

      this.Locations = res;
      this.locationID = this.selectedLocation;

      this.loadLocationsMulti()
        .pipe(map(x => x.filter(y => !y.disabled)))
        .subscribe((res) => {
          this.Locations = res;
          var arr = [];
          this.Locations.forEach(element => {
            arr.push(element.locationID);
          });
          this.selectedLocations = arr;
          
          this.getData(this.selectedLocations.toString());
        });

    });

  }
  loadLocationsMulti(term: string = null): Observable<Location[]> {
    let items = this.Locations;
    if (term) {
      items = items.filter(x => x.name.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }
  Filter() {
    
    this.getData(this.selectedLocations.toString());
  }
  printout(html) {

    var newWindow = window.open('_self');
    newWindow.document.write(html);
    newWindow.print();
  }
}
