// Me Quotes
import { MeQuotesComponent } from "src/app/components/pages/me-profile/me-quotes/me-quotes.component";
import { MeQuoteCreateComponent } from "src/app/components/pages/me-profile/me-quotes/create/create.component";
import { MeQuoteViewComponent } from "src/app/components/pages/me-profile/me-quotes/create/view.component";
import { MeQuoteDetailsComponent } from "src/app/components/pages/me-profile/me-quotes/details/details.component";
import { MeQuoteUpdateComponent } from "src/app/components/pages/me-profile/me-quotes/update/update.component";
import { MeQuoteDeleteComponent } from "src/app/components/pages/me-profile/me-quotes/delete/delete.component";

// Me Quotes Massives
import { MeQuotesMassiveComponent } from "src/app/components/pages/me-profile/me-quotes-massive/me-quotes-massive.component";
import { MeQuotesMassiveCreateComponent } from "src/app/components/pages/me-profile/me-quotes-massive/create/create.component";
import { MeQuotesMassiveDeleteComponent } from "src/app/components/pages/me-profile/me-quotes-massive/delete/delete.component";
import { MeQuotesMassiveDetailsComponent } from "src/app/components/pages/me-profile/me-quotes-massive/details/details.component";
import { MeQuotesMassiveShipmentsComponent } from "src/app/components/pages/me-profile/me-quotes-massive/shipments/massive_shipments.component";

// Me Shipments
import { MeShipmentComponent } from "src/app/components/pages/me-profile/me-shipment/me-shipment.component";
import { MeShipmentViewComponent } from "src/app/components/pages/me-profile/me-shipment/create/view.component";
import { MeShipmentCreateComponent } from "src/app/components/pages/me-profile/me-shipment/create/create.component";
import { MeShipmentDetailsComponent } from "src/app/components/pages/me-profile/me-shipment/details/details.component";
import { MeShipmentUpdateComponent } from "src/app/components/pages/me-profile/me-shipment/update/update.component";
import { MeShipmentCancelComponent } from "src/app/components/pages/me-profile/me-shipment/cancel/cancel.component";
import { MeShipmentDeleteComponent } from "src/app/components/pages/me-profile/me-shipment/delete/delete.component";

// Me Shipments Massives
import { MyProfileComponent } from "src/app/components/pages/me-profile/myprofile/my-profile.component";
import { MyProfileUpdateComponent } from "src/app/components/pages/me-profile/myprofile/update/my-profile-update.component";
import { MeShipmentMassiveComponent } from "src/app/components/pages/me-profile/me-shipment-massive/me-shipment-massive.component";
import { MeShipmentMassiveCreateComponent } from "src/app/components/pages/me-profile/me-shipment-massive/create/create.component";
import { MeShipmentMassiveDeleteComponent } from "src/app/components/pages/me-profile/me-shipment-massive/delete/delete.component";
import { MeShipmentMassiveDetailsComponent } from "src/app/components/pages/me-profile/me-shipment-massive/details/details.component";
import { MeShipmentMassiveUpdateComponent } from "src/app/components/pages/me-profile/me-shipment-massive/update/update.component";

// Export all components from me profile
export const MeProfileModules = [

    // Me Quotes
    MeQuotesComponent,
    MeQuoteCreateComponent,
    MeQuoteViewComponent,
    MeQuoteDetailsComponent,
    MeQuoteUpdateComponent,
    MeQuoteDeleteComponent,

    // Me Quotes Massives
    MeQuotesMassiveComponent,
    MeQuotesMassiveCreateComponent,
    MeQuotesMassiveDeleteComponent,
    MeQuotesMassiveDetailsComponent,
    MeQuotesMassiveShipmentsComponent,

    // Me Shipments
    MeShipmentComponent,
    MeShipmentViewComponent,
    MeShipmentCreateComponent,
    MeShipmentDetailsComponent,
    MeShipmentUpdateComponent,
    MeShipmentCancelComponent,
    MeShipmentDeleteComponent,

    // Me Shipments Massives
    MeShipmentMassiveComponent,
    MeShipmentMassiveCreateComponent,
    MeShipmentMassiveDeleteComponent,
    MeShipmentMassiveDetailsComponent,
    MeShipmentMassiveUpdateComponent,

    // Me Profile
    MyProfileComponent,
    MyProfileUpdateComponent,

];