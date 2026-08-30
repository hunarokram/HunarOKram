import mongoose, { Model, Document, UpdateQuery, Types } from 'mongoose';
type FilterQuery<T> = any;

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).lean().exec() as Promise<T | null>;
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).lean().exec() as Promise<T | null>;
  }

  async findMany(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).lean().exec() as Promise<T[]>;
  }

  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create(data);
    return created.toObject() as T;
  }

  async update(id: string | Types.ObjectId, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { returnDocument: 'after' }).lean().exec() as Promise<T | null>;
  }

  async delete(id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findByIdAndDelete(id).lean().exec() as Promise<T | null>;
  }
}

export abstract class BaseTenantRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(organizerId: string | Types.ObjectId, id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findOne({ _id: id, organizerId } as FilterQuery<T>).lean().exec() as Promise<T | null>;
  }

  async findOne(organizerId: string | Types.ObjectId, filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne({ ...filter, organizerId }).lean().exec() as Promise<T | null>;
  }

  async findMany(organizerId: string | Types.ObjectId, filter: FilterQuery<T> = {}, sort: any = { createdAt: -1 }): Promise<T[]> {
    return this.model.find({ ...filter, organizerId }).sort(sort).lean().exec() as Promise<T[]>;
  }

  async create(organizerId: string | Types.ObjectId, data: Partial<T>): Promise<T> {
    const doc = new this.model({ ...data, organizerId });
    return doc.save();
  }

  async update(organizerId: string | Types.ObjectId, id: string | Types.ObjectId, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate({ _id: id, organizerId } as FilterQuery<T>, data, { returnDocument: 'after' }).lean().exec() as Promise<T | null>;
  }

  async delete(organizerId: string | Types.ObjectId, id: string | Types.ObjectId): Promise<T | null> {
    return this.model.findOneAndDelete({ _id: id, organizerId } as FilterQuery<T>).lean().exec() as Promise<T | null>;
  }
}
