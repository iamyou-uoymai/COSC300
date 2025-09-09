// Artifact management utilities
import { db } from './app.js';
import { collection, getDocs, doc, getDoc, query, where, orderBy, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Get all enabled artifacts for the main user interface
export async function getEnabledArtifacts() {
  try {
    const artifactsQuery = query(
      collection(db, 'artifacts'), 
      where('enabled', '==', true),
      orderBy('name')
    );
    const querySnapshot = await getDocs(artifactsQuery);
    
    const enabledArtifacts = [];
    querySnapshot.forEach((doc) => {
      enabledArtifacts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return enabledArtifacts;
  } catch (error) {
    console.error('Error getting enabled artifacts:', error);
    return [];
  }
}

// Get specific artifact by ID
export async function getArtifact(artifactId) {
  try {
    const docRef = doc(db, 'artifacts', artifactId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      console.log('No such artifact!');
      return null;
    }
  } catch (error) {
    console.error('Error getting artifact:', error);
    return null;
  }
}

// Increment artifact view count
export async function incrementArtifactViews(artifactId) {
  try {
    const docRef = doc(db, 'artifacts', artifactId);
    await updateDoc(docRef, {
      views: increment(1),
      lastViewedAt: new Date()
    });
    console.log(`Incremented view count for artifact: ${artifactId}`);
  } catch (error) {
    console.error('Error incrementing artifact views:', error);
  }
}

// Check if artifact is enabled before allowing access
export async function isArtifactEnabled(artifactId) {
  try {
    const artifact = await getArtifact(artifactId);
    return artifact && artifact.enabled;
  } catch (error) {
    console.error('Error checking artifact status:', error);
    return false;
  }
}
