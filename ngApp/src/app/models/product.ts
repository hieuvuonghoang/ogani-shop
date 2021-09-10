import { Category } from "./category";
import { Image } from "./image";
import { Uom } from "./uom";

export class Product {
    public _id: string = "";
    public __v: string = "";
    public name: string = "";
    public description: string = "";
    public information: string = "";
    public availability: number = 0;
    public weight: number = 0;
    public price: number = 0;
    public category: Category | undefined;
    public images: Image[] = [];
    public uomWeight: Uom | undefined;
    public uomAvailability: Uom | undefined;
    public shortDescription: string = "";

    constructor() {
        
    }
}
