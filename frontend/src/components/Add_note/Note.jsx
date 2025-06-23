import React, { useState, useEffect, useCallback } from 'react';

const Note = () => {
  // State to store blog posts
  const [blogs, setBlogs] = useState([]);
  // State for "Add New Task" modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  // State for "Open Blog" (view) modal visibility
  const [showViewModal, setShowViewModal] = useState(false);
  // State for the blog data to be displayed in the view modal
  const [selectedBlog, setSelectedBlog] = useState(null);
  // State for form fields when adding/editing a blog
  const [formData, setFormData] = useState({
    id: '',
    imageUrl: '',
    blogTitle: '',
    blogType: '',
    blogDescription: '',
  });
  // State to track if we are in edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State to track the ID of the blog being edited
  const [editingBlogId, setEditingBlogId] = useState(null);

  // Load data from local storage on component mount
  useEffect(() => {
    try {
      const getInitialData = localStorage.getItem("blog");
      if (getInitialData) {
        const { cards } = JSON.parse(getInitialData);
        setBlogs(cards || []);
      }
    } catch (error) {
      console.error("Failed to load blogs from local storage:", error);
      setBlogs([]); // Fallback to empty array on error
    }
  }, []);

  // Update local storage whenever the 'blogs' state changes
  useEffect(() => {
    localStorage.setItem("blog", JSON.stringify({ cards: blogs }));
  }, [blogs]);

  // Handle input changes for the form
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Function to save new blog changes or updated blog changes
  const saveChanges = () => {
    if (!formData.blogTitle || !formData.imageUrl || !formData.blogType || !formData.blogDescription) {
      // Basic validation
      alert("Please fill in all fields."); // Using alert for simplicity, replace with custom modal in production
      return;
    }

    if (isEditing) {
      // Update existing blog
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog.id === editingBlogId ? { ...formData, id: editingBlogId } : blog
        )
      );
      setIsEditing(false);
      setEditingBlogId(null);
    } else {
      // Add new blog
      const newBlog = {
        ...formData,
        id: `${Date.now()}`, // Unique ID for new blog
      };
      setBlogs((prevBlogs) => [...prevBlogs, newBlog]);
    }

    // Reset form and close modal
    setFormData({
      id: '',
      imageUrl: '',
      blogTitle: '',
      blogType: '',
      blogDescription: '',
    });
    setShowAddModal(false);
  };

  // Function for deleting a card
  const deleteCard = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) { // Using confirm for simplicity
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
    }
  }, []);

  // Function for editing a card
  const editCard = useCallback((id) => {
    const blogToEdit = blogs.find((blog) => blog.id === id);
    if (blogToEdit) {
      setFormData(blogToEdit);
      setIsEditing(true);
      setEditingBlogId(id);
      setShowAddModal(true); // Open the add/edit modal
    }
  }, [blogs]);

  // Function to open the detailed blog view modal
  const openBlog = useCallback((id) => {
    const blogToView = blogs.find((blog) => blog.id === id);
    if (blogToView) {
      setSelectedBlog(blogToView);
      setShowViewModal(true);
    }
  }, [blogs]);

  // JSX for a single blog card
  const BlogCard = ({ id, imageUrl, blogTitle, blogType, blogDescription }) => (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card shadow-lg rounded-lg overflow-hidden h-full flex flex-col">
        <div className="card-header p-3 bg-gray-100 flex justify-end gap-2 border-b border-gray-200">
          <button
            type="button"
            className="btn bg-green-500 text-white hover:bg-green-600 rounded-md px-3 py-1 text-sm transition-colors duration-200"
            onClick={() => editCard(id)}
          >
            <i className="fas fa-pencil-alt mr-1"></i>Edit
          </button>
          <button
            type="button"
            className="btn bg-red-500 text-white hover:bg-red-600 rounded-md px-3 py-1 text-sm transition-colors duration-200"
            onClick={() => deleteCard(id)}
          >
            <i className="fas fa-trash-alt mr-1"></i>Delete
          </button>
        </div>
        <img
          src={imageUrl}
          className="card-img-top w-full h-48 object-cover"
          alt={blogTitle}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x300/e0e0e0/505050?text=Image+Not+Found`;
          }}
        />
        <div className="card-body p-4 flex-grow">
          <h5 className="card-title text-xl font-bold mb-2 text-gray-800">{blogTitle}</h5>
          <p className="card-text text-gray-600 line-clamp-3">{blogDescription}</p>
          <span className="badge bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-2 inline-block">
            {blogType}
          </span>
        </div>
        <div className="card-footer bg-gray-50 p-3 border-t border-gray-200">
          <button
            type="button"
            className="btn bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2 float-end text-sm transition-colors duration-200"
            onClick={() => openBlog(id)}
          >
            Open Blog
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      {/* Add New Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h5 className="text-xl font-semibold text-gray-800">{isEditing ? "Edit Blog" : "Add New Blog"}</h5>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => {
                  setShowAddModal(false);
                  setIsEditing(false);
                  setEditingBlogId(null);
                  setFormData({ id: '', imageUrl: '', blogTitle: '', blogType: '', blogDescription: '' });
                }}
              >
                &times;
              </button>
            </div>
            <form>
              <div className="mb-3">
                <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  id="imageUrl"
                  placeholder="https://images.example.com/blog.png"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="blogTitle" className="block text-gray-700 text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  id="blogTitle"
                  placeholder="Artificial Intelligence"
                  value={formData.blogTitle}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="blogType" className="block text-gray-700 text-sm font-medium mb-1">Type</label>
                <input
                  type="text"
                  className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  id="blogType"
                  placeholder="AI"
                  value={formData.blogType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="blogDescription" className="block text-gray-700 text-sm font-medium mb-1">Description</label>
                <textarea
                  rows="4"
                  className="form-control w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  id="blogDescription"
                  value={formData.blogDescription}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </form>
            <div className="flex justify-end gap-3 mt-4 border-t pt-4">
              <button
                type="button"
                className="btn bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-md px-4 py-2 transition-colors duration-200"
                onClick={() => {
                  setShowAddModal(false);
                  setIsEditing(false);
                  setEditingBlogId(null);
                  setFormData({ id: '', imageUrl: '', blogTitle: '', blogType: '', blogDescription: '' });
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 transition-colors duration-200"
                onClick={saveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card View Modal */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={() => setShowViewModal(false)}
              >
                &times;
              </button>
            </div>
            <img
              src={selectedBlog.imageUrl}
              alt={selectedBlog.blogTitle}
              className="w-full h-64 object-cover rounded-md mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/e0e0e0/505050?text=Image+Not+Found`;
              }}
            />
            <div className="text-sm text-gray-500 mb-2">Created on {new Date(parseInt(selectedBlog.id)).toDateString()}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2 inline-block mr-2">{selectedBlog.blogTitle}</h2>
            <span className="badge bg-blue-500 text-white text-sm px-3 py-1 rounded-full">{selectedBlog.blogType}</span>
            <p className="text-gray-700 mt-4 leading-relaxed">
              {selectedBlog.blogDescription}
            </p>
            <div className="flex justify-end mt-6 border-t pt-4">
              <button
                type="button"
                className="btn bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-md px-4 py-2 transition-colors duration-200"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <a className="navbar-brand text-2xl font-bold text-blue-600" href="#">Blog</a>
          <button
            className="navbar-toggler md:hidden text-gray-600 focus:outline-none"
            type="button"
            onClick={() => { /* Toggle mobile menu if implemented */ }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-4">
              <li><a className="nav-link text-gray-700 hover:text-blue-600 font-medium" href="#">Home</a></li>
            </ul>
            <button
              type="button"
              className="btn bg-blue-600 text-white hover:bg-blue-700 rounded-full px-5 py-2 flex items-center space-x-2 transition-colors duration-200"
              onClick={() => {
                setShowAddModal(true);
                setIsEditing(false); // Ensure it's not in edit mode when opening for new
                setFormData({ id: '', imageUrl: '', blogTitle: '', blogType: '', blogDescription: '' }); // Clear form
              }}
            >
              <i className="fas fa-plus"></i>
              <span>Add New</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} {...blog} />
            ))}
          </div>
        </section>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" xintegrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
};

export default Note;
