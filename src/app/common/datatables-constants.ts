/**
 * CONSTANTES PARA LAS TABLAS QUE DEFINE SU ESTRUCTURA GENERAL
 * Permiten definir la estructura general de una tabla
*/
export class DataTableConstants
{
  public static ItemTotalAll    : number    = 0;
  public static ItemPerPage     : number    = 30;
  public static AllowFiltering  : boolean   = true;
  public static PaginarColor    : string    = "warn";
  public static PageSizeOptions : number[]  = [10, 15, 30, 50, 100, 200, 500];
  public static MessageForEmpty : string    = "No hay datos para mostrar ";
}