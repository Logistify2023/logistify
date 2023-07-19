export class GlobalConstants {
  public static apiURL: string =
  // "http://18.210.69.110/api/v1";
  "http://54.172.217.230/api/v1";
  // "http://192.168.1.73:8000/api/v1";

  public static snackConfig: any = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    duration: 6000,
    panelClass: ['mat-snack-bar-success'],
  };

  public static countNotifications: number = 0;
}