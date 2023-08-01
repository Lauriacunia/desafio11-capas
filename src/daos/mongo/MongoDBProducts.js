import MongoClass from "./MongoClass.js";
import { productsSchema } from "./models/ProductsSchema.js";

export class MongoDBProducts extends MongoClass {
  constructor() {
    super("products", productsSchema);
  }

  async getAll(limit, page, sort, query) {
    try {
      /**El primer argumento es el filtro de busqueda,
       * el segundo es son las opciones de paginado.
       * La propiedad lean en la expresión que has mostrado se refiere a una
       * opción de mongoose-paginate-v2 que indica
       * si los documentos recuperados de la consulta deben
       * ser convertidos en objetos JavaScript simples en lugar
       *  de instancias completas de modelos de Mongoose. */
      /**{ title: 'Iphone X Upd2222' } acceder al value de un objeto
       */
      const filter = query
        ? { title: { $regex: query.title, $options: "i" } }
        : {};
      /** La "i" de las options hace que no discrimine mayúsculas o minúsculas */
      const all = await this.baseModel.paginate(filter, {
        limit: limit || 10,
        page: page || 1,
        sort: sort || {},
        lean: true,
      });
      return all;
    } catch (err) {
      throw new Error(err);
    }
  }
}
