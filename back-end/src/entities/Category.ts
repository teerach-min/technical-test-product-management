export class Category {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public description: string | null,
    public isActive: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
