// Customers
import { ClientsComponent } from '../app/components/pages/clients/clients/clients.component';
import { ClientsCreateComponent } from '../app/components/pages/clients/clients/create/create.component';
import { ClientsUpdateComponent } from '../app/components/pages/clients/clients/update/update.component';
import { ClientsDeleteComponent } from '../app/components/pages/clients/clients/delete/delete.component';
import { ClientsRestoreComponent } from '../app/components/pages/clients/clients/restore/restore.component';
import { ClientsDetailsComponent } from '../app/components/pages/clients/clients/details/details.component';

// Customers: Profile
import { ProfilesComponent } from '../app/components/pages/clients/profiles/profiles.component';
import { ProfilesCreateComponent } from '../app/components/pages/clients/profiles/create/create.component';
import { ProfilesUpdateComponent } from '../app/components/pages/clients/profiles/update/update.component';
import { ProfilesDeleteComponent } from '../app/components/pages/clients/profiles/delete/delete.component';
import { ProfilesRestoreComponent } from '../app/components/pages/clients/profiles/restore/restore.component';
import { ProfilesDetailsComponent } from '../app/components/pages/clients/profiles/details/details.component';

// Customers: CustomerType
import { TypesComponent } from '../app/components/pages/clients/types/types.component';
import { TypesCreateComponent } from '../app/components/pages/clients/types/create/create.component';
import { TypesUpdateComponent } from '../app/components/pages/clients/types/update/update.component';
import { TypesDeleteComponent } from '../app/components/pages/clients/types/delete/delete.component';
import { TypesRestoreComponent } from '../app/components/pages/clients/types/restore/restore.component';
import { TypesDetailsComponent } from '../app/components/pages/clients/types/details/details.component';

// Customers: Contacts
import { ContactsComponent } from '../app/components/pages/clients/contacts/contacts.component';
import { ContactsCreateComponent } from '../app/components/pages/clients/contacts/create/create.component';
import { ContactsUpdateComponent } from '../app/components/pages/clients/contacts/update/update.component';
import { ContactsDeleteComponent } from '../app/components/pages/clients/contacts/delete/delete.component';
import { ContactsRestoreComponent } from '../app/components/pages/clients/contacts/restore/restore.component';
import { ContactsDetailsComponent } from '../app/components/pages/clients/contacts/details/details.component';

// Customers: Turns
import { TurnsComponent } from '../app/components/pages/clients/turns/turns.component';
import { TurnsCreateComponent } from '../app/components/pages/clients/turns/create/create.component';
import { TurnsUpdateComponent } from '../app/components/pages/clients/turns/update/update.component';
import { TurnsDeleteComponent } from '../app/components/pages/clients/turns/delete/delete.component';
import { TurnsRestoreComponent } from '../app/components/pages/clients/turns/restore/restore.component';
import { TurnsDetailsComponent } from '../app/components/pages/clients/turns/details/details.component';

// Export all components from customer
export const CustomerModules = [

  // Customers
  ClientsComponent,
  ClientsCreateComponent,
  ClientsUpdateComponent,
  ClientsDeleteComponent,
  ClientsRestoreComponent,
  ClientsDetailsComponent,

  // Customers: Profile
  ProfilesComponent,
  ProfilesCreateComponent,
  ProfilesUpdateComponent,
  ProfilesDeleteComponent,
  ProfilesRestoreComponent,
  ProfilesDetailsComponent,

  // Customers: CustomerTypes
  TypesComponent,
  TypesCreateComponent,
  TypesUpdateComponent,
  TypesDeleteComponent,
  TypesRestoreComponent,
  TypesDetailsComponent,

  // Customers: Contacts
  ContactsComponent,
  ContactsCreateComponent,
  ContactsUpdateComponent,
  ContactsDeleteComponent,
  ContactsRestoreComponent,
  ContactsDetailsComponent,

  // Customers: Turns
  TurnsComponent,
  TurnsCreateComponent,
  TurnsUpdateComponent,
  TurnsDeleteComponent,
  TurnsRestoreComponent,
  TurnsDetailsComponent,

];