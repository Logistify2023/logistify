// Address
import { AddressComponent } from "src/app/components/pages/settings/address/address.component";
import { AddressCreateComponent } from "src/app/components/pages/settings/address/create/create.component";
import { AddressDeleteComponent } from "src/app/components/pages/settings/address/delete/delete.component";
import { AddressDetailsComponent } from "src/app/components/pages/settings/address/details/details.component";
import { AddressUpdateComponent } from "src/app/components/pages/settings/address/update/update.component";

// Services-fuel
import { ServicesFuelComponent } from "src/app/components/pages/settings/services-fuel/services-fuel.component";

// Services Groups
import { ServicesGroupComponent } from "src/app/components/pages/settings/services-group/services-group.component";
import { GroupDetailsComponent } from "src/app/components/pages/settings/services-group/details/details.component";
import { GroupUpdateComponent } from "src/app/components/pages/settings/services-group/update/update.component";

// Cotizador seguro
import { InsuranceComponent } from "src/app/components/pages/settings/insurance/insurance.component";

// Auditorias
import { AuditCustomersComponent } from "src/app/components/pages/auditorias/customers/audit-customers.component";
import { AuditCouriersComponent } from "src/app/components/pages/auditorias/couriers/audit-couriers.component";

// Export all components from setting and others
export const SettingsModules = [

    // Address
    AddressComponent,
    AddressCreateComponent,
    AddressDeleteComponent,
    AddressDetailsComponent,
    AddressUpdateComponent,

    // Service-fuel
    ServicesFuelComponent,

    // Services-groups
    ServicesGroupComponent,
    GroupDetailsComponent,
    GroupUpdateComponent,

    // Insurance
    InsuranceComponent,

    // Audit customer
    AuditCustomersComponent,
    AuditCouriersComponent,

];