import categoryData from '../mockData/categories.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let categories = [...categoryData];

export const categoryService = {
  async getAll() {
    await delay(150);
    return [...categories];
  },

  async getById(id) {
    await delay(100);
    const category = categories.find(c => c.Id === parseInt(id, 10));
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(250);
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    const updatedCategory = {
      ...categories[index],
      ...updateData,
      Id: categories[index].Id // Prevent ID modification
    };
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Category not found');
    }
    categories.splice(index, 1);
    return true;
  },

  async updateTaskCount(categoryName, count) {
    await delay(100);
    const category = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (category) {
      category.taskCount = count;
      return { ...category };
    }
    return null;
  }
};

export default categoryService;