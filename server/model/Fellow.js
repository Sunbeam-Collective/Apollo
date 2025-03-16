// IGNORE FOR NOW, template/reference file

const knex = require('./knex');

/*
This class provides an interface for managing Fellow data.
Instances of this class can't do much really. They just store data.

The class itself provides static methods for CRUD actions on
the collection of fellows.
*/
class Fellow {

  static async create(name) {
    const { rows } = await knex.raw(`
      INSERT INTO fellows (name)
      VALUES(?)
      RETURNING *
    `, [name]);

    return rows[0];
  }

  static async list() { // Get all
    const { rows } = await knex.raw(`
      SELECT * FROM fellows;
    `);

    return rows;
  }

  static async find(id) { // Get one
    const { rows } = await knex.raw(`
      SELECT * FROM fellows
      WHERE id=?
    `, [id]);

    return rows[0];
  }

  static async editName(id, newName) { // Update
    const { rows } = await knex.raw(`
      UPDATE fellows
      SET name=?
      WHERE id=?
      RETURNING *;
    `, [newName, id]);

    return rows[0];
  }

  static async delete(id) { // Delete
    const { rows } = await knex.raw(`
      DELETE FROM fellows
      WHERE id=?
      RETURNING *;
    `, [id]);

    return rows;
  }
}

module.exports = Fellow;
