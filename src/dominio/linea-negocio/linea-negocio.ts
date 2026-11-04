export default class LineaNegocio {
  constructor(
    public id: number,
    public nombre: string,
    public productos: string[],
    public codigo: string | null = null,
  ) {}
}
