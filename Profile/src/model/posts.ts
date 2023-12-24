export class posts {
  constructor(
    public date_pub: Date,
    public id_user: number,
    public nbr_like?: number,
    public date_sup?: Date,
    public content?: String,
    public url_img?: string,
    public id?: number
  ) {}
}
