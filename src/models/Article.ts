import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featureImage: string;
  author: mongoose.Types.ObjectId;
  category: string;
  tags: string[];
  status: string;
  publishedAt: Date;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema<IArticle> = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, maxlength: 200, default: '' },
    content: { type: String, default: '' },
    featureImage: { type: String, default: '' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['Politics', 'Economy', 'Tech', 'Culture', 'Opinion'],
      required: true,
    },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
