---
title: Use useOptimistic for Instant UI Feedback
impact: MEDIUM
impactDescription: eliminates perceived latency for mutations
tags: rerender, optimistic, useOptimistic, mutations, UX
---

## Use useOptimistic for Instant UI Feedback

`useOptimistic` provides instant UI feedback while server operations complete in the background. Use it for actions where waiting for server response degrades UX.

**Traditional flow (blocks UI):**

```tsx
// User clicks → Wait for server → Update UI → User sees change
//                 [1-3 seconds of waiting]

function LikeButton({ post }: { post: Post }) {
  const [isLiked, setIsLiked] = useState(post.isLiked)

  const handleLike = async () => {
    await likePost(post.id)  // User waits for response
    setIsLiked(true)         // Only then sees the change
  }

  return <button onClick={handleLike}>{isLiked ? '❤️' : '🤍'}</button>
}
```

**Correct (optimistic update):**

```tsx
// User clicks → Update UI immediately → Server confirms in background
//              [Instant feedback]      [Rollback if error]

import { useOptimistic } from 'react'
import { likePost } from '@/app/actions'

function LikeButton({ post }: { post: Post }) {
  const [optimisticPost, setOptimisticPost] = useOptimistic(
    post,
    (currentPost, newLikeState: boolean) => ({
      ...currentPost,
      isLiked: newLikeState,
      likes: newLikeState ? currentPost.likes + 1 : currentPost.likes - 1
    })
  )

  const handleLike = async () => {
    const newLikeState = !optimisticPost.isLiked
    setOptimisticPost(newLikeState)      // Update UI immediately
    await likePost(post.id, newLikeState) // Server action in background
    // If action fails, React automatically reverts to original state
  }

  return (
    <button onClick={handleLike}>
      {optimisticPost.isLiked ? '❤️' : '🤍'} {optimisticPost.likes}
    </button>
  )
}
```

**Adding items with optimistic state:**

```tsx
import { useOptimistic } from 'react'
import { addTodo } from '@/app/actions'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo: Todo) => [...currentTodos, newTodo]
  )

  const handleSubmit = async (formData: FormData) => {
    const text = formData.get('text') as string

    // Create optimistic todo with temporary ID
    const optimisticTodo: Todo = {
      id: `temp-${Date.now()}`,
      text,
      completed: false
    }

    addOptimisticTodo(optimisticTodo)  // Show immediately
    await addTodo(formData)             // Server creates real todo
  }

  return (
    <div>
      <form action={handleSubmit}>
        <input name="text" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li
            key={todo.id}
            style={{ opacity: todo.id.startsWith('temp-') ? 0.6 : 1 }}
          >
            {todo.text}
            {todo.id.startsWith('temp-') && ' (saving...)'}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Combining with useTransition for pending state:**

```tsx
import { useOptimistic, useTransition } from 'react'
import { deleteItem } from '@/app/actions'

function ItemList({ items }: { items: Item[] }) {
  const [isPending, startTransition] = useTransition()

  const [optimisticItems, removeOptimisticItem] = useOptimistic(
    items,
    (currentItems, removedId: string) =>
      currentItems.filter(item => item.id !== removedId)
  )

  const handleDelete = (id: string) => {
    startTransition(async () => {
      removeOptimisticItem(id)  // Remove from UI immediately
      await deleteItem(id)       // Delete on server
    })
  }

  return (
    <ul>
      {optimisticItems.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => handleDelete(item.id)} disabled={isPending}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

**When to use:**

| Use Case | Use useOptimistic? | Why |
|----------|-------------------|-----|
| Like/favorite buttons | ✅ Yes | Instant feedback essential |
| Add to cart | ✅ Yes | User expects immediate response |
| Delete item | ✅ Yes | Removal should feel instant |
| Send message | ✅ Yes | Chat UX requires speed |
| Payment | ❌ No | Must confirm before showing |
| Critical data | ❌ No | Accuracy over speed |

Reference: [useOptimistic](https://react.dev/reference/react/useOptimistic)
