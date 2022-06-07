import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerOrders, OrderCheckout, OrderDetails, Orders } from 'src/app/_models/Orders';
import { ToastService } from 'src/app/_services/toastservice';
import { Location } from 'src/app/_models/Location';
import { OrdersService } from 'src/app/_services/orders.service';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/_services/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({

  selector: 'app-orderdetails', 
  templateUrl:'./modal-content.component.html',
  template: `  
   <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
     
<div class="card shadow mb-4">
    <div class="card-header py-3">
        <div class="row">
            <div class="col-md-6">
                <h6 class="m-0 font-weight-bold text-orange">Order Details - <span class="badge badge-info"> {{ dataObj.statusID == 100 ? "Delivered" : dataObj.statusID==101 ?"Order confirmed" : dataObj.statusID == 102? "Order prepared" : dataObj.statusID == 103? " Order out for delivery" : dataObj.statusID == 104? "Order Cancelled" : "-" }}</span></h6>
            </div>
            <div class="col-md-6 text-right">

            </div>
        </div>
        <hr/>
        <div class="row">
        <!-- <div class="col-md-12 mb-4" *ngIf="order.statusID!=100">
                <div class="card border-left-info shadow mb-4">
                    <div class="card-header border-bottom-0">Order Status</div>
                    <div class="card-body">
                      <div class="">
                        <button class="btn btn-warning mr-1" (click)="updateOrder(order,102)" *ngIf="order.statusID!=102">
                          <i class="fas fa-check-circle"></i> Prepared
                        </button>
                        <button class="btn btn-info mr-1" (click)="updateOrder(order,103)" *ngIf="order.statusID!=103">
                          <i class="fas fa-truck"></i> Out For Delivery
                        </button>
                        <button class="btn btn-success mr-1" (click)="updateOrder(order,100)" *ngIf="order.statusID!=100">
                          <i class="fas fa-people-carry"></i> Delivered
                        </button>
                        <button class="btn btn-danger mr-1" (click)="updateOrder(order,104)">
                          <i class="fas fa-people-carry"></i> Cancelled
                        </button>
                      </div>
                    </div>
                </div>
            </div> -->
            <div class="col-md-6 mb-4">

                <div class="card border-left-success shadow mb-4">
                    <div class="card-body">
                        <div class="card">
                            <div class="card-header border-bottom-0">Customer Information</div>

                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                      Customer Name
                                    </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.customerOrders.name }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                     Email
                                    </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.customerOrders.email }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                      Address
                                    </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.customerOrders.addressNickName }}</div>



                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                    Google Address
                                    </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.customerOrders.address }} | Latitude: {{ dataObj.customerOrders.latitude }}| Longitude: {{ dataObj.customerOrders.longitude }}</div>



                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                       Contact Number
                                    </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.customerOrders.Mobile }}</div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="card border-left-warning shadow ">

                    <div class="card-body">

                        <!-- Report summary card example-->
                        <div class="card">
                            <div class="card-header border-bottom-0">Order Information</div>

                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                           Order No
                                        </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.order.orderNo }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                           Transaction No
                                        </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.order.transactionNo }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                           Order Type
                                        </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.order.orderType=='1'?'Home': dataObj.order.orderType=='2'?'Work':'Other' }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                          Order Date
                                        </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.order.orderDate }}</div>
                            </div>
                            
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                         Status
                                        </a>
                                    </div>
                                </div>

                                <div class="mr-2">
                                    {{ dataObj.order.statusID == 100 ? "Delivered" : dataObj.order.statusID==101 ?"Order confirmed" : dataObj.order.statusID == 102? "Order prepared" : dataObj.order.statusID == 103? " Order out for delivery" : dataObj.order.statusID == 104? "Order Cancelled" : "-" }}
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div class="col-md-6 mb-4">
                <div class="card border-left-danger shadow mb-4">

                    <div class="card-body">
                        <div class="card">
                            <div class="card-header border-bottom-0">Billing Information</div>

                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                  Amount Total
                                </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ (dataObj.orderCheckouts.amountTotal)}}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                  Discount
                                </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.orderCheckouts.discountAmount }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                  Tax
                                </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.orderCheckouts.tax}}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                                  Service Charges
                                </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.orderCheckouts.serviceCharges }}</div>
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="flex-grow-1">
                                    <div class="list-group list-group-flush small">
                                        <a class="list-group-item list-group-item-action" href="#!">
                           Grand Total
                                </a>
                                    </div>
                                </div>
                                <div class="mr-2">{{ dataObj.order.grandTotal }}</div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="card border-left-primary shadow">

                    <div class="card-body">
                        <div class="tile-body p-0 table-responsive ">
                            <table class="table table-striped">
                                <thead>
                                    <tr class="table-header">
                                        <th width="50%">Name </th>
                                        <th width="25">Quantity</th>
                                        <th width="25">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr *ngFor="let item of dataObj.orderDetails ">
                                        <td> {{item.name}}
                                            <tr *ngFor="let item1 of item.orderDetailModifiers ">
                                                <td class="badge badge-pill">Modifier: {{item1.modifierName }} [{{item.Quantity}}X {{item1.price}} ] </td>

                                            </tr>
                                        </td>
                                        <td> {{item.quantity}} </td>
                                        <td> {{item.price}} </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>

        </div>

    </div>
</div>    
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `,
})
export class NgbdModalContent {
  
  @Input() name;
  dataObj: any = {}; 
  constructor(public activeModal: NgbActiveModal) {}    
}
