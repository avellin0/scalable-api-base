import { db } from "../../infra/Database/Connect";

export abstract class BaseRepository<
    TSchema extends Record<string, any>,
    TCreate extends Record<string, any>,
> {
    constructor(protected readonly table: string, private tenant_id?: string) {}

    async find(params: { where: Partial<TSchema> }) {
        const keys = Object.keys(params.where);
        const values = Object.values(params.where);

        const conditions = keys.map((_, index) => `${keys} = $${index + 1}`)
            .join(" AND ");

        const query = `
            SELECT * FROM ${this.table}
            WHERE ${conditions}
        `;

        return await db.query(query, values);
    }

    async delete(params: {
        where: Partial<TSchema>;
    }) {
        const keys = Object.keys(params.where);
        const values = Object.values(params.where);

        const condition = keys.map((_, index) => `
            ${keys} = $${index + 1}
        `).join(" AND ");

        const query = `
            DELETE FROM ${this.table} WHERE ${condition};
        `;

        return db.query(query, values);
    }

    async create(data: TCreate) {
        const keys = Object.keys(data!);
        const values = Object.values(data!);

        const columns = keys.join(", ");
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

        const query = `
        INSERT INTO ${this.table} (${columns})
        VALUES (${placeholders});
        `;

        return db.query(query, values);
    }

    async findMany(params: {
        where: Partial<TSchema>;
    }) {
        const keys = Object.keys(params.where);
        const values = Object.values(params.where);

        const conditions = keys.map((_, index) => `${keys} = $${index + 1}`)
            .join(" AND ");

        const query = `
            SELECT * FROM ${this.table}
            WHERE ${conditions}
            AND tenant_id = ${this.tenant_id}
        `;

        return db.query(query, values);
    }

    async update(
        params: {
            data: Partial<Omit<TSchema, "id" | "created_at">>;
            where: Partial<TSchema>;
        },
    ) {
        const updateKeys = Object.keys(params.data);
        const updateValues = Object.values(params.data);

        const searchKeys = Object.keys(params.where);
        const searchValues = Object.values(params.where);

        const setClause = updateKeys.map((key, index) =>
            `${key} = $${index + 1}`
        ).join(", ");

        const whereClause = searchKeys.map(
            (key, index) => `${key} = $${updateKeys.length + index + 1}`,
        ).join(" AND ");

        const query = `
        UPDATE ${this.table}
        SET ${setClause}
        WHERE ${whereClause}
        RETURNING *
    `;

        return db.query(query, [...updateValues, ...searchValues]);
    }

    async findAll() {        
        const query = `
            SELECT * FROM ${this.table}
        `;
        return await db.query(query);
    }
}
