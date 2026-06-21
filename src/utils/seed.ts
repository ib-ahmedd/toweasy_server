import { Driver } from '../models/driver.model.js';

export const seedDriver = async () => {
  try {
    const count = await Driver.countDocuments();
    if (count === 0) {
      await Driver.create({ name: 'John Doe (Test Driver)', isOnline: false });
      console.log('Test driver seeded');
    }
  } catch (error) {
    console.error('Error seeding driver:', error);
  }
};
