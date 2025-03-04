// Mock Firebase Admin SDK for development purposes
// In a real application, you would use the actual Firebase Admin SDK

// Mock Auth class
class MockAuth {
  async verifyIdToken(token: string) {
    // In a real app, this would verify the token with Firebase
    // For our mock, we'll just return a dummy decoded token
    
    // Extract user ID from token if it's in our expected format
    let uid = 'dummy-user-id';
    try {
      // If token is in JSON format with a uid field, use that
      const parsedToken = JSON.parse(token);
      if (parsedToken.uid) {
        uid = parsedToken.uid;
      }
    } catch (e) {
      // If token is not JSON, check if it's our dummy token format
      if (token.includes('uid:')) {
        uid = token.split('uid:')[1].split(',')[0];
      }
    }
    
    return {
      uid,
      email: 'user@example.com',
      email_verified: true,
    };
  }
}

// Mock Firestore class
class MockFirestore {
  collection(path: string) {
    return {
      doc: (id: string) => ({
        get: async () => ({
          exists: true,
          data: () => ({}),
          id,
        }),
        set: async (data: any) => {},
        update: async (data: any) => {},
        delete: async () => {},
      }),
      where: () => ({
        get: async () => ({
          empty: false,
          docs: [],
          forEach: (callback: Function) => {},
        }),
      }),
      add: async (data: any) => ({ id: 'mock-doc-id' }),
    };
  }
}

// Mock initialization function
export function initFirebaseAdmin() {
  // No-op in our mock implementation
  console.log('Mock Firebase Admin initialized');
}

// Export mock instances
const adminAuth = new MockAuth();
const adminDb = new MockFirestore();

export { adminAuth, adminDb };