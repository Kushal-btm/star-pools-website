import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface ContactForm {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export interface Project {
    id: bigint;
    title: string;
    featured: boolean;
    description: string;
    imageUrl: string;
    category: Category;
    photos: Array<string>;
}
export interface UserProfile {
    name: string;
}
export interface Testimonial {
    id: bigint;
    customerName: string;
    featured: boolean;
    message: string;
    rating: bigint;
    location: string;
}
export enum Category {
    construction = "construction",
    lighting = "lighting",
    maintenance = "maintenance",
    renovation = "renovation"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProjectPhoto(projectId: bigint, photoUrl: string): Promise<void>;
    adminCreateProject(adminSecret: string, title: string, description: string, category: Category, imageUrl: string, featured: boolean, photos: Array<string>): Promise<void>;
    adminCreateTestimonial(adminSecret: string, customerName: string, location: string, rating: bigint, message: string, featured: boolean): Promise<void>;
    adminDeleteProject(adminSecret: string, id: bigint): Promise<void>;
    adminDeleteTestimonial(adminSecret: string, id: bigint): Promise<void>;
    adminGetAllContactForms(adminSecret: string): Promise<Array<ContactForm>>;
    adminUpdateProject(adminSecret: string, id: bigint, title: string, description: string, category: Category, imageUrl: string, featured: boolean, photos: Array<string>): Promise<void>;
    adminUpdateTestimonial(adminSecret: string, id: bigint, customerName: string, location: string, rating: bigint, message: string, featured: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(title: string, description: string, category: Category, imageUrl: string, featured: boolean, photos: Array<string>): Promise<void>;
    createTestimonial(customerName: string, location: string, rating: bigint, message: string, featured: boolean): Promise<void>;
    deleteProject(id: bigint): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    getAllContactForms(): Promise<Array<ContactForm>>;
    getAllProjects(): Promise<Array<Project>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProjects(): Promise<Array<Project>>;
    getFeaturedTestimonials(): Promise<Array<Testimonial>>;
    getProjectPhotos(projectId: bigint): Promise<Array<string>>;
    getProjectsByCategory(category: Category): Promise<Array<Project>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitContactForm(name: string, email: string, phone: string, message: string): Promise<void>;
    updateProject(id: bigint, title: string, description: string, category: Category, imageUrl: string, featured: boolean, photos: Array<string>): Promise<void>;
    updateTestimonial(id: bigint, customerName: string, location: string, rating: bigint, message: string, featured: boolean): Promise<void>;
}
