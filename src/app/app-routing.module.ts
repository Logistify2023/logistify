// By Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Authentication
import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './components/pages/login/login.component';
import { RestorePasswordComponent } from './components/pages/restore-password/restore-password.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';

// Other modules
import { TermsComponent } from './components/pages/terms/terms.component';
import { ContactUsComponent } from './components/pages/contact-us/contact-us.component';
import { AddressComponent } from './components/pages/settings/address/address.component';
import { ServicesFuelComponent } from './components/pages/settings/services-fuel/services-fuel.component';
import { ServicesGroupComponent } from './components/pages/settings/services-group/services-group.component';
import { InsuranceComponent } from './components/pages/settings/insurance/insurance.component';
import { AuditCustomersComponent } from './components/pages/auditorias/customers/audit-customers.component';
import { AuditCouriersComponent } from './components/pages/auditorias/couriers/audit-couriers.component';

// Me Profile
import { MyProfileComponent } from './components/pages/me-profile/myprofile/my-profile.component';
import { NotificationsComponent } from './components/pages/profile/notifications/notifications.component';
import { DashboardComponent } from './components/pages/profile/dashboard/dashboard.component';
import { MeQuotesComponent } from './components/pages/me-profile/me-quotes/me-quotes.component';
import { MeQuotesMassiveComponent } from './components/pages/me-profile/me-quotes-massive/me-quotes-massive.component';
import { MeShipmentComponent } from './components/pages/me-profile/me-shipment/me-shipment.component';
import { MeShipmentMassiveComponent } from './components/pages/me-profile/me-shipment-massive/me-shipment-massive.component';

// Colabs
import { CollaboratorsComponent } from './components/pages/collaborators/collaborators.component';
import { AreasComponent } from './components/pages/users/areas/areas.component';
import { PermissionsComponent } from './components/pages/users/permissions/permissions.component';
import { RolesComponent } from './components/pages/users/roles/roles.component';
import { StallsComponent } from './components/pages/users/stalls/stalls.component';
import { ClassificationsComponent } from './components/pages/users/classifications/classifications.component';

// Customers
import { ClientsComponent } from './components/pages/clients/clients/clients.component';
import { ProfilesComponent } from './components/pages/clients/profiles/profiles.component';
import { TypesComponent } from './components/pages/clients/types/types.component';
import { TurnsComponent } from './components/pages/clients/turns/turns.component';
import { ContactsComponent } from './components/pages/clients/contacts/contacts.component';
import { BranchOfficesComponent } from './components/pages/clients/branch-offices/branch-offices.component';
import { BranchOfficesTypesComponent } from './components/pages/clients/branch-offices-types/branch-offices-types.component';
import { CostsCenterComponent } from './components/pages/clients/costs-center/costs-center.component';

// Merchandise
import { ProductsComponent } from './components/pages/products/products/products.component';
import { CategoriesComponent } from './components/pages/products/categories/categories.component';
import { UnitsComponent } from './components/pages/products/units/units.component';
import { LocationsComponent } from './components/pages/products/locations/locations.component';
import { LossesComponent } from './components/pages/products/losses/losses.component';
import { ProvidersComponent } from './components/pages/products/providers/providers.component';
import { SpendingsComponent } from './components/pages/products/spendings/spendings.component';
import { SuppliesComponent } from './components/pages/products/supplies/supplies.component';
import { ExpensesComponent } from './components/pages/products/expenses/expenses.component';
import { BrandsComponent } from './components/pages/products/brands/brands.component';

// Couriers
import { MessengerComponent } from './components/pages/messenger/messenger/messenger.component';
import { CourierTypesComponent } from './components/pages/messenger/courier-types/courier-types.component';
import { ProfilesServicesComponent } from './components/pages/messenger/profiles-services/profiles-services.component';
import { TypePricesComponent } from './components/pages/messenger/type-prices/type-prices.component';
import { ServicesComponent } from './components/pages/messenger/services/services.component';
import { ServicesTypesComponent } from './components/pages/messenger/services-types/services-types.component';
import { WebServicesComponent } from './components/pages/messenger/web-services/web-services.component';
import { DeliveryDaysComponent } from './components/pages/messenger/delivery-days/delivery-days.component';
import { AdditionalChargesComponent } from './components/pages/messenger/additional-charges/additional-charges.component';
import { AdditionalChargesTypesComponent } from './components/pages/messenger/additional-charges-types/additional-charges-types.component';

// Shipments
import { StatusComponent } from './components/pages/shipments/status/status.component';
import { ClaimsComponent } from './components/pages/shipments/claims/claims.component';
import { EventsComponent } from './components/pages/shipments/events/events.component';
import { DeliveryTimesComponent } from './components/pages/shipments/delivery-times/delivery-times.component';
import { QuoteComponent } from './components/pages/shipments/quote/quote.component';
import { ShipmentsComponent } from './components/pages/shipments/shipments.component';
import { IncidencesTypesComponent } from './components/pages/shipments/incidences-types/incidences-types.component';
import { IncidencesComponent } from './components/pages/shipments/incidences/incidences.component';
import { ReceiversComponent } from './components/pages/shipments/receivers/receivers.component';
import { TrackerComponent } from './components/pages/shipments/tracker/tracker.component';
import { QuoteMassiveComponent } from './components/pages/shipments/quote-massive/quote-massive.component';

// Name App
const name: string = "Logistify Carrier Hub ";

// All routes
const routes: Routes = [

  // ROUTES FOR AUTH
  {
    title: name,
    path: 'login',
    component: LoginComponent
  },
  {
    title: name + "- Recuperar cuenta",
    path: 'recovery-password',
    component: RestorePasswordComponent
  },
  {
    title: name + "- Restablecer contraseña",
    path: 'restore-password/:token',
    component: ResetPasswordComponent
  },
  {
    title: name + "- Términos y condiciones",
    path: 'terms',
    component: TermsComponent
  },
  {
    title: name + "- Contacto",
    path: 'contact-us',
    component: ContactUsComponent
  },

  // ROUTE BY DEFECT
  {
    title: name,
    path: '', component: DashboardComponent,
    canActivate: [AuthGuard] 
  },

  // ROUTES FOR ME PROFILE
  {
    title: name + "- Mi perfil",
    path: 'me-profile',
    component: MyProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    title: name + "- Mi tablero",
    path: 'me-dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] 
  },
  {
    title: name + "- Mis notificaciones",
    path: 'me-notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard] 
  },
  {
    title: name + "- Mis cotizaciones",
    path: 'me-quotes',
    component: MeQuotesComponent,
    canActivate: [AuthGuard] 
  },
  {
    title: name + "- Mis cotizaciones masivas",
    path: 'me-quotes-massive',
    component: MeQuotesMassiveComponent,
    canActivate: [AuthGuard] 
  },
  {
    title: name + "- Mis envíos",
    path: 'me-shipments',
    component: MeShipmentComponent,
    canActivate: [AuthGuard] 
  },
  {
    title: name + "- Mis envíos masivos",
    path: 'me-shipments-massive',
    component: MeShipmentMassiveComponent,
    canActivate: [AuthGuard] 
  },

  // ROUTES FOR COLABS
  {
    title: name + "- Colaboradores",
    path: 'users/users',
    component: CollaboratorsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'user.index',
    }
  },
  /* {
    title: name + "- Colaborador",
    path: 'user/profile/:slug',
    component: DetailsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'user.index',
    }
  }, */
  {
    title: name + "- Áreas",
    path: 'user/areas',
    component: AreasComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'area.index',
    }
  },
  {
    title: name + "- Permisos",
    path: 'user/permissions',
    component: PermissionsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'permission.index',
    }
  },
  {
    title: name + "- Roles",
    path: 'user/roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'role.index',
    }
  },
  {
    title: name + "- Puestos",
    path: 'user/stalls',
    component: StallsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'stall.index',
    }
  },
  {
    title: name + "- Clasificaciones",
    path: 'user/classifications',
    component: ClassificationsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'classification.index',
    }
  },

  /* ROUTES FOR CUSTOMER */
  {
    title: name + "- Clientes",
    path: 'clients/clients',
    component: ClientsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'customer.index',
    }
  },
  {
    title: name + "- Perfiles",
    path: 'clients/profiles',
    component: ProfilesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'profile.index',
    }
  },
  {
    title: name + "- Perfiles venta",
    path: 'clients/profiles-services',
    component: ProfilesServicesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'profile-service.index',
    }
  },
  {
    title: name + "- Tipo clientes",
    path: 'clients/types',
    component: TypesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'customer-type.index',
    }
  },
  {
    title: name + "- Giros",
    path: 'clients/turns',
    component: TurnsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'turns.index',
    }
  },
  {
    title: name + "- Contactos",
    path: 'clients/contacts',
    component: ContactsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'contact.index',
    }
  },
  {
    title: name + "- Sucursales",
    path: 'clients/branch-offices',
    component: BranchOfficesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'branch-office.index',
    }
  },
  {
    title: name + "- Tipo sucursal",
    path: 'clients/branch-offices-types',
    component: BranchOfficesTypesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'branch-office-type.index',
    }
  },
  {
    title: name + "- Centro costos",
    path: 'clients/costs-center',
    component: CostsCenterComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'costs-center.index',
    }
  },

  // ROUTES FOR SHIPMENTS
  {
    title: name + "- Envíos",
    path: 'shipments',
    component: ShipmentsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'shipment.index',
    }
  },
  {
    title: name + "- Envíos",
    path: 'shipments/shipments',
    component: ShipmentsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'shipment.index',
    }
  },
  {
    title: name + "- Envíos masivos",
    path: 'shipments/shipments-massive',
    component: ShipmentsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'shipment.index',
    }
  },
  {
    title: name + "- Cotizaciones",
    path: 'shipments/quotes',
    component: QuoteComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'shipment.index',
    }
  },
  {
    title: name + "- Cotizaciones masivas",
    path: 'shipments/quotes-massive',
    component: QuoteMassiveComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'shipment.index',
    }
  },
  {
    title: name + "- Reclamaciones",
    path: 'shipments/claims',
    component: ClaimsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'claim.index',
    }
  },
  {
    title: name + "- Tipo incidencias",
    path: 'shipments/incidences-types',
    component: IncidencesTypesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'incidence-type.index',
    }
  },
  {
    title: name + "- Incidencias",
    path: 'shipments/incidences',
    component: IncidencesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'incidence.index',
    }
  },
  {
    title: name + "- Eventos",
    path: 'shipments/events',
    component: EventsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'event.index',
    }
  },
  {
    title: name + "- Tipo entregas",
    path: 'shipments/delivery-times',
    component: DeliveryTimesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'delivery-time.index',
    }
  },
  {
    title: name + "- Receptores",
    path: 'shipments/receivers',
    component: ReceiversComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'receiver.index',
    }
  },
  {
    title: name + "- Estados",
    path: 'shipments/status',
    component: StatusComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'state.index',
    }
  },
  {
    title: name + "- Extra cargos",
    path: 'shipments/extra-charges',
    component: ShipmentsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'additional-charge.index',
    }
  },
  {
    title: name + "- Cargos adicionales",
    path: 'shipments/statements',
    component: ShipmentsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'additional-charge.index',
    }
  },

  // ROUTES FOR TRACKING
  
  {
    title: name + "- Rastreo",
    path: 'tracking',
    component: TrackerComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'shipment.index',
    }
  },
  
  {
    title: name + "- Rastro",
    path: 'tracking/status/:param',
    component: TrackerComponent,
  },

  // ROUTES FOR MERCHANDISE
  {
    title: name + "- Mercancías",
    path: 'products/products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'product.index',
    }
  },
  {
    title: name + "- Categorías",
    path: 'products/categories',
    component: CategoriesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'category.index',
    }
  },
  {
    title: name + "- Marcas",
    path: 'products/brands',
    component: BrandsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'mark.index',
    }
  },
  {
    title: name + "- Unidad medidas",
    path: 'products/units',
    component: UnitsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'measure-unit.index',
    }
  },
  {
    title: name + "- Ubicaciones",
    path: 'products/locations',
    component: LocationsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'location.index',
    }
  },
  {
    title: name + "- Perdidas",
    path: 'products/losses',
    component: LossesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'losse.index',
    }
  },
  {
    title: name + "- Proveedores",
    path: 'products/providers',
    component: ProvidersComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'provider.index',
    }
  },
  {
    title: name + "- Gastos",
    path: 'products/spendings',
    component: SpendingsComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'spending.index',
    }
  },
  {
    title: name + "- Insumos",
    path: 'products/expenses',
    component: ExpensesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'expense.index',
    }
  },
  {
    title: name + "- Tipo gastos",
    path: 'products/supplies',
    component: SuppliesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'supply.index',
    }
  },

  // ROUTES FOR COURIERS
  {
    title: name + "- Mensajerías",
    path: 'couriers/couriers',
    component: MessengerComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'courier.index',
    }
  },
  {
    title: name + "- Catalogo productos",
    path: 'couriers/services',
    component: ServicesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'service.index',
    }
  },
  {
    title: name + "- Tipo productos",
    path: 'couriers/services-types',
    component: ServicesTypesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'service-type.index',
    }
  },
  {
    title: name + "- Servicios web",
    path: 'couriers/web-services',
    component: WebServicesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'web-service.index',
    }
  },
  {
    title: name + "- Día entregas",
    path: 'couriers/delivery-days',
    component: DeliveryDaysComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'delivery-day.index',
    }
  },
  {
    title: name + "- Cargos adicionales",
    path: 'couriers/additional-charges',
    component: AdditionalChargesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'additional-charge.index',
    }
  },
  {
    title: name + "- Grupo cargos adicionales",
    path: 'couriers/additional-charges-types',
    component: AdditionalChargesTypesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'additional-charge-type.index',
    }
  },
  {
    title: name + "- Tipo mensajerías",
    path: 'couriers/courier-types',
    component: CourierTypesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'courier-type.index',
    }
  },
  {
    title: name + "- Tipo precios",
    path: 'couriers/type-prices',
    component: TypePricesComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'type-price.index',
    }
  },

  // ROUTES ADDITIONALS FOR SERVICE
  {
    title: name + "- Configuraciones",
    path: 'settings/configurations',
    component: AddressComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'setting.index',
    }
  },
  {
    title: name + "- Direcciones",
    path: 'settings/address',
    component: AddressComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'address.index',
    }
  },
  {
    title: name + "- Combustibles",
    path: 'settings/fuels',
    component: ServicesFuelComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'service.index',
    }
  },
  {
    title: name + "- Grupos",
    path: 'settings/groups',
    component: ServicesGroupComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'service.index',
    }
  },
  {
    title: name + "- Cotizador seguro",
    path: 'settings/insurance',
    component: InsuranceComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'insurance.index',
    }
  },
  {
    title: name + "- Auditar clientes",
    path: 'audit/customers',
    component: AuditCustomersComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'audit.customers',
    }
  },
  {
    title: name + "- Auditar mensajerías",
    path: 'audit/couriers',
    component: AuditCouriersComponent,
    canActivate: [AuthGuard],
    data: {
      canView: 'audit.couriers',
    }
  },

  // ROUTE BY DEFAULT
  {
    title: name + "- Mi tablero",
    path: '**',
    pathMatch: 'full',
    redirectTo: 'me-dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }