// hooks.jsx
import React, { useState, useEffect } from 'react';
import { useActionState, useFormStatus, useOptimistic, use } from 'react'; // Note: 'use' is a special function, not a hook.

/**
 * =================================================================
 * 1. useActionState
 *
 * This hook is for managing the state of an asynchronous action,
 * like a form submission. It simplifies handling pending states,
 * errors, and success messages, reducing boilerplate.
 * =================================================================
 */

// A mock server/client action function
async function submitFeedback(prevState, formData) {
  // Simulate a server-side delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  const feedback = formData.get('feedback');

  if (feedback.length < 10) {
    return { success: false, message: 'Feedback must be at least 10 characters long.' };
  }
  return { success: true, message: 'Thank you for your feedback!' };
}

export function FeedbackFormWithActionState() {
  const [state, formAction, isPending] = useActionState(submitFeedback, { message: null });

  return (
    <form action={formAction}>
      <h2>useActionState Example</h2>
      <textarea name="feedback" placeholder="Your feedback..." required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}

/**
 * =================================================================
 * 2. useFormStatus
 *
 * This hook provides real-time information about the status of
 * the nearest parent form's submission. It's great for creating
 * reusable components, like a submit button, that need to react
 * to the form's state.
 * =================================================================
 */

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

export function FeedbackFormWithFormStatus() {
  const [state, formAction] = useActionState(submitFeedback, { message: null });

  return (
    <form action={formAction}>
      <h2>useFormStatus Example</h2>
      <textarea name="feedback" placeholder="Your feedback..." required />
      <SubmitButton />
      {state.message && <p>{state.message}</p>}
    </form>
  );
}

/**
 * =================================================================
 * 3. useOptimistic
 *
 * This hook creates an optimistic UI update. It allows you to
 * display an immediate "expected" result of an asynchronous action
 * while the network request is pending. If the request fails,
 * the UI can automatically revert.
 * =================================================================
 */

// A mock async function to like a post
async function likePost(postId) {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { postId, newLikes: 1 };
}

export function PostWithOptimisticLikes({ initialLikes, postId }) {
  const [likes, setLikes] = useState(initialLikes);
  // `useOptimistic` takes the current state and a function to compute the optimistic state
  const [optimisticLikes, addOptimisticLikes] = useOptimistic(likes, (currentLikes, newLikes) => currentLikes + newLikes);

  const handleLike = async () => {
    // Optimistically update the UI
    addOptimisticLikes(1);
    try {
      await likePost(postId);
      // The real state is updated by the server response
      setLikes(likes + 1);
    } catch (error) {
      // If the request fails, the optimistic update is automatically reverted.
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div>
      <h2>useOptimistic Example</h2>
      <p>Likes: {optimisticLikes}</p>
      <button onClick={handleLike}>Like</button>
    </div>
  );
}


/**
 * =================================================================
 * 4. `use` API
 *
 * This function allows you to read the value of resources like
 * a Promise directly within your component's render logic,
 * simplifying data fetching. It suspends rendering until the
 * promise resolves, working with <Suspense> and Error Boundaries.
 * =================================================================
 */

// A memoized or external async function to fetch data
const fetchUser = async (userId) => {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
};

export function UserProfileWithUseApi({ userId }) {
  // The promise should be created outside the component or memoized.
  const userPromise = fetchUser(userId);
  
  // `use` suspends until the promise resolves.
  // This component must be wrapped in a <Suspense> boundary.
  const user = use(userPromise);

  return (
    <div>
      <h2>'use' API Example</h2>
      <p>Hello, {user.name}</p>
    </div>
  );
}


// To use these components, you would typically render them like this:
/*
import {
  FeedbackFormWithActionState,
  FeedbackFormWithFormStatus,
  PostWithOptimisticLikes,
  UserProfileWithUseApi
} from './hooks.jsx';
import { Suspense } from 'react';

function App() {
  return (
    <div>
      <FeedbackFormWithActionState />
      <hr />
      <FeedbackFormWithFormStatus />
      <hr />
      <PostWithOptimisticLikes initialLikes={10} postId={123} />
      <hr />
      <Suspense fallback={<div>Loading user...</div>}>
        <UserProfileWithUseApi userId={456} />
      </Suspense>
    </div>
  );
}
*/