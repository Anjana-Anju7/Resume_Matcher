const mongoose = require('mongoose');
require('dotenv').config();
const { User, Analysis } = require('../models');

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (development only)
    if (process.env.NODE_ENV === 'development') {
      await User.deleteMany({});
      await Analysis.deleteMany({});
      console.log('🧹 Cleared existing data');
    }

    // Create test users
    const testUsers = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        subscription: 'free'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        subscription: 'premium'
      }
    ];

    const createdUsers = await User.create(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nTest Accounts:');
    testUsers.forEach(user => {
      console.log(`📧 ${user.email} | 🔑 ${user.password} | 📋 ${user.subscription}`);
    });

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;