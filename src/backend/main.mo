import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile System
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Contact Form Module
  module ContactForm {
    public type ContactForm = {
      id : Nat;
      name : Text;
      email : Text;
      phone : Text;
      message : Text;
      timestamp : Time.Time;
    };

    public func compare(form1 : ContactForm, form2 : ContactForm) : Order.Order {
      Nat.compare(form1.id, form2.id);
    };
  };

  // Project Module
  module Project {
    public type Project = {
      id : Nat;
      title : Text;
      description : Text;
      category : Category;
      imageUrl : Text;
      featured : Bool;
      photos : [Text];
    };

    public type Category = {
      #construction;
      #renovation;
      #maintenance;
      #lighting;
    };

    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };
  };

  // Testimonial Module
  module Testimonial {
    public type Testimonial = {
      id : Nat;
      customerName : Text;
      location : Text;
      rating : Nat;
      message : Text;
      featured : Bool;
    };

    public func compare(testimonial1 : Testimonial, testimonial2 : Testimonial) : Order.Order {
      Nat.compare(testimonial1.id, testimonial2.id);
    };
  };

  // Data Storage
  let contactForms = Map.empty<Nat, ContactForm.ContactForm>();
  let projects = Map.empty<Nat, Project.Project>();
  let testimonials = Map.empty<Nat, Testimonial.Testimonial>();

  var nextContactFormId = 1;
  var nextProjectId = 1;
  var nextTestimonialId = 1;

  // Helper function to check admin token
  func isAdminToken(secret : Text) : Bool {
    secret == "starpools-admin-kushal-2024";
  };

  // Contact Form Functions
  public shared ({ caller }) func submitContactForm(name : Text, email : Text, phone : Text, message : Text) : async () {
    let newForm : ContactForm.ContactForm = {
      id = nextContactFormId;
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactForms.add(nextContactFormId, newForm);
    nextContactFormId += 1;
  };

  public query ({ caller }) func getAllContactForms() : async [ContactForm.ContactForm] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access contact forms");
    };
    contactForms.values().toArray().sort();
  };

  public query ({ caller }) func adminGetAllContactForms(adminSecret : Text) : async [ContactForm.ContactForm] {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    contactForms.values().toArray().sort();
  };

  // Project Functions
  public shared ({ caller }) func createProject(
    title : Text,
    description : Text,
    category : Project.Category,
    imageUrl : Text,
    featured : Bool,
    photos : [Text],
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };
    let newProject : Project.Project = {
      id = nextProjectId;
      title;
      description;
      category;
      imageUrl;
      featured;
      photos;
    };
    projects.add(nextProjectId, newProject);
    nextProjectId += 1;
  };

  public shared ({ caller }) func updateProject(
    id : Nat,
    title : Text,
    description : Text,
    category : Project.Category,
    imageUrl : Text,
    featured : Bool,
    photos : [Text],
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        let updatedProject : Project.Project = {
          id;
          title;
          description;
          category;
          imageUrl;
          featured;
          photos;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };
    projects.remove(id);
  };

  public shared ({ caller }) func addProjectPhoto(projectId : Nat, photoUrl : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add project photos");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("addProjectPhoto: Project not found") };
      case (?project) {
        let photosList = List.fromArray(project.photos);
        photosList.add(photoUrl);
        let updatedProject = { project with photos = photosList.toArray() };
        projects.add(projectId, updatedProject);
      };
    };
  };

  public query ({ caller }) func getProjectPhotos(projectId : Nat) : async [Text] {
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("getProjectPhotos: Project not found") };
      case (?project) { project.photos };
    };
  };

  public query ({ caller }) func getAllProjects() : async [Project.Project] {
    projects.values().toArray().sort();
  };

  public query ({ caller }) func getFeaturedProjects() : async [Project.Project] {
    let filtered = projects.values().toArray().filter(func(p) { p.featured });
    filtered.sort();
  };

  public query ({ caller }) func getProjectsByCategory(category : Project.Category) : async [Project.Project] {
    let filtered = projects.values().toArray().filter(func(p) { p.category == category });
    filtered.sort();
  };

  // Token-based admin project functions
  public shared ({ caller }) func adminCreateProject(
    adminSecret : Text,
    title : Text,
    description : Text,
    category : Project.Category,
    imageUrl : Text,
    featured : Bool,
    photos : [Text],
  ) : async () {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    let newProject : Project.Project = {
      id = nextProjectId;
      title;
      description;
      category;
      imageUrl;
      featured;
      photos;
    };
    projects.add(nextProjectId, newProject);
    nextProjectId += 1;
  };

  public shared ({ caller }) func adminUpdateProject(
    adminSecret : Text,
    id : Nat,
    title : Text,
    description : Text,
    category : Project.Category,
    imageUrl : Text,
    featured : Bool,
    photos : [Text],
  ) : async () {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?_) {
        let updatedProject : Project.Project = {
          id;
          title;
          description;
          category;
          imageUrl;
          featured;
          photos;
        };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func adminDeleteProject(adminSecret : Text, id : Nat) : async () {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    projects.remove(id);
  };

  // Testimonial Functions
  public shared ({ caller }) func createTestimonial(customerName : Text, location : Text, rating : Nat, message : Text, featured : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create testimonials");
    };
    let newTestimonial : Testimonial.Testimonial = {
      id = nextTestimonialId;
      customerName;
      location;
      rating;
      message;
      featured;
    };
    testimonials.add(nextTestimonialId, newTestimonial);
    nextTestimonialId += 1;
  };

  public shared ({ caller }) func updateTestimonial(id : Nat, customerName : Text, location : Text, rating : Nat, message : Text, featured : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial not found") };
      case (?_) {
        let updatedTestimonial : Testimonial.Testimonial = {
          id;
          customerName;
          location;
          rating;
          message;
          featured;
        };
        testimonials.add(id, updatedTestimonial);
      };
    };
  };

  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };
    testimonials.remove(id);
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial.Testimonial] {
    testimonials.values().toArray().sort();
  };

  public query ({ caller }) func getFeaturedTestimonials() : async [Testimonial.Testimonial] {
    let filtered = testimonials.values().toArray().filter(func(t) { t.featured });
    filtered.sort();
  };

  // Token-based admin testimonial functions
  public shared ({ caller }) func adminCreateTestimonial(adminSecret : Text, customerName : Text, location : Text, rating : Nat, message : Text, featured : Bool) : async () {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    let newTestimonial : Testimonial.Testimonial = {
      id = nextTestimonialId;
      customerName;
      location;
      rating;
      message;
      featured;
    };
    testimonials.add(nextTestimonialId, newTestimonial);
    nextTestimonialId += 1;
  };

  public shared ({ caller }) func adminUpdateTestimonial(adminSecret : Text, id : Nat, customerName : Text, location : Text, rating : Nat, message : Text, featured : Bool) : async () {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial not found") };
      case (?_) {
        let updatedTestimonial : Testimonial.Testimonial = {
          id;
          customerName;
          location;
          rating;
          message;
          featured;
        };
        testimonials.add(id, updatedTestimonial);
      };
    };
  };

  public shared ({ caller }) func adminDeleteTestimonial(adminSecret : Text, id : Nat) : async () {
    if (not isAdminToken(adminSecret)) {
      Runtime.trap("Unauthorized: Invalid admin token");
    };
    testimonials.remove(id);
  };
};
