// Collaborators
import { CollaboratorsComponent } from '../app/components/pages/collaborators/collaborators.component';
import { CollaboratorsCreateComponent } from '../app/components/pages/collaborators/create/create.component';
import { CollaboratorsUpdateComponent } from '../app/components/pages/collaborators/update/update.component';
import { CollaboratorsDeleteComponent } from '../app/components/pages/collaborators/delete/delete.component';
import { CollaboratorsRestoreComponent } from '../app/components/pages/collaborators/restore/restore.component';
import { CollaboratorsDetailsComponent } from '../app/components/pages/collaborators/details/details.component';

// Collaborators: Areas 
import { AreasComponent } from '../app/components/pages/users/areas/areas.component';
import { AreasCreateComponent } from '../app/components/pages/users/areas/create/create.component';
import { AreasUpdateComponent } from '../app/components/pages/users/areas/update/update.component';
import { AreasDeleteComponent } from '../app/components/pages/users/areas/delete/delete.component';
import { AreasRestoreComponent } from '../app/components/pages/users/areas/restore/restore.component';
import { AreasDetailsComponent } from '../app/components/pages/users/areas/details/details.component';

// Collaborators: Permissions 
import { PermissionsComponent } from '../app/components/pages/users/permissions/permissions.component';
import { PermissionsCreateComponent } from '../app/components/pages/users/permissions/create/create.component';
import { PermissionsUpdateComponent } from '../app/components/pages/users/permissions/update/update.component';
import { PermissionsDeleteComponent } from '../app/components/pages/users/permissions/delete/delete.component';
import { PermissionsRestoreComponent } from '../app/components/pages/users/permissions/restore/restore.component';
import { PermissionsDetailsComponent } from '../app/components/pages/users/permissions/details/details.component';

// Collaborators: Roles 
import { RolesComponent } from '../app/components/pages/users/roles/roles.component';
import { RolesCreateComponent } from '../app/components/pages/users/roles/create/create.component';
import { RolesUpdateComponent } from '../app/components/pages/users/roles/update/update.component';
import { RolesDeleteComponent } from '../app/components/pages/users/roles/delete/delete.component';
import { RolesRestoreComponent } from '../app/components/pages/users/roles/restore/restore.component';
import { RolesDetailsComponent } from '../app/components/pages/users/roles/details/details.component';

// Collaborators: Stalls 
import { StallsComponent } from '../app/components/pages/users/stalls/stalls.component';
import { StallsCreateComponent } from '../app/components/pages/users/stalls/create/create.component';
import { StallsUpdateComponent } from '../app/components/pages/users/stalls/update/update.component';
import { StallsDeleteComponent } from '../app/components/pages/users/stalls/delete/delete.component';
import { StallsRestoreComponent } from '../app/components/pages/users/stalls/restore/restore.component';
import { StallsDetailsComponent } from '../app/components/pages/users/stalls/details/details.component';

// Collaborators: Classifications 
import { ClassificationsComponent } from '../app/components/pages/users/classifications/classifications.component';
import { ClassificationsCreateComponent } from '../app/components/pages/users/classifications/create/create.component';
import { ClassificationsUpdateComponent } from '../app/components/pages/users/classifications/update/update.component';
import { ClassificationsDeleteComponent } from '../app/components/pages/users/classifications/delete/delete.component';
import { ClassificationsRestoreComponent } from '../app/components/pages/users/classifications/restore/restore.component';
import { ClassificationsDetailsComponent } from '../app/components/pages/users/classifications/details/details.component';

// Exportamos all components from colabs or users
export const CollaboratorsModules = [

  // Collaborators
  CollaboratorsComponent,
  CollaboratorsCreateComponent,
  CollaboratorsUpdateComponent,
  CollaboratorsDeleteComponent,
  CollaboratorsRestoreComponent,
  CollaboratorsDetailsComponent,

  // Collaborators: Areas
  AreasComponent,
  AreasCreateComponent,
  AreasUpdateComponent,
  AreasDeleteComponent,
  AreasRestoreComponent,
  AreasDetailsComponent,

  // Collaborators: Stalls
  StallsComponent,
  StallsCreateComponent,
  StallsUpdateComponent,
  StallsDeleteComponent,
  StallsRestoreComponent,
  StallsDetailsComponent,

  // Collaborators: Roles
  RolesComponent,
  RolesCreateComponent,
  RolesUpdateComponent,
  RolesDeleteComponent,
  RolesRestoreComponent,
  RolesDetailsComponent,

  // Collaborators: Permissions
  PermissionsComponent,
  PermissionsCreateComponent,
  PermissionsUpdateComponent,
  PermissionsDeleteComponent,
  PermissionsRestoreComponent,
  PermissionsDetailsComponent,

  // Collaborators: Classifications
  ClassificationsComponent,
  ClassificationsCreateComponent,
  ClassificationsUpdateComponent,
  ClassificationsDeleteComponent,
  ClassificationsRestoreComponent,
  ClassificationsDetailsComponent,

];