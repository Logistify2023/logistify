import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';

// Angular Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Material
import { MaterialModules } from '../modules/material.module';

// Charts and Toastr
import { GoogleChartsModule } from 'angular-google-charts';
import { ToastrModule } from 'ngx-toastr';

// Pipes
import { SearchFilterPipe } from './pipes/search-filter.pipe';
import { ReplaceTextPipe } from './pipes/replace-text.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

// Directives
import { HaveAccessDirective } from './auth/directives/have-access.directive';

// Pages
import { LoginComponent } from './components/pages/login/login.component';
import { DashboardComponent } from './components/pages/profile/dashboard/dashboard.component';
import { NotificationsComponent } from './components/pages/profile/notifications/notifications.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { RestorePasswordComponent } from './components/pages/restore-password/restore-password.component';
import { TermsComponent } from './components/pages/terms/terms.component';
import { ContactUsComponent } from './components/pages/contact-us/contact-us.component';
import { TrackerComponent } from './components/pages/shipments/tracker/tracker.component';

// Pages Modules
import { ShipmentsModules } from '../modules/shipments.modules';
import { CollaboratorsModules } from '../modules/collaborators.modules';
import { ProductsModules } from '../modules/products.modules';
import { CouriersModules } from '../modules/couriers.modules';
import { ClientsModules } from '../modules/clients.modules copy';
import { CustomerModules } from '../modules/customer.modules';
import { SettingsModules } from 'src/modules/settings.modules';
import { MeProfileModules } from 'src/modules/meprofile.modules';
import { TrackingModules } from 'src/modules/tracking.modules';

@NgModule({
  declarations: [
    // Page first
    AppComponent,

    // Auth Pages
    LoginComponent,
    ResetPasswordComponent,
    RestorePasswordComponent,

    // Other Pages
    DashboardComponent,
    NotificationsComponent,
    TermsComponent,
    ContactUsComponent,
    TrackerComponent,

    // Pages Modules
    ShipmentsModules,
    CollaboratorsModules,
    ProductsModules,
    CouriersModules,
    ClientsModules,
    CustomerModules,
    SettingsModules,
    MeProfileModules,
    TrackingModules,

    // Pipes
    SearchFilterPipe,
    ReplaceTextPipe,
    SafeHtmlPipe,

    // Directives
    HaveAccessDirective,
  ],

  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonToggleModule,
    MatRadioModule,
    ToastrModule.forRoot(),
    GoogleChartsModule.forRoot(
      {
        version: '51',
        mapsApiKey: '<your Google Maps API Key here>'
      }
    ),

    ReactiveFormsModule,
    FormsModule,

    GoogleChartsModule,
    FlexLayoutModule,

    MaterialModules
  ],

  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy 
    }
  ],

  bootstrap: [
    AppComponent
  ],

  exports: [
    HaveAccessDirective
  ],

})

export class AppModule { }