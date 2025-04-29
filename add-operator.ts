import { storage } from './server/storage';

async function addOperator() {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByUsername('Danieldev12');
    
    if (existingUser) {
      console.log('Operator account already exists');
      return;
    }
    
    // Create operator account
    const operator = await storage.createUser({
      username: 'Danieldev12',
      password: 'dan122012',
      fullname: 'Daniel Operator',
      email: 'operator@example.com'
    });
    
    console.log('Operator account created successfully:', {
      id: operator.id,
      username: operator.username,
      fullname: operator.fullname,
      email: operator.email
    });
  } catch (error) {
    console.error('Error creating operator account:', error);
  }
}

addOperator();
