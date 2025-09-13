import { useState, useEffect, useRef, TouchEvent } from 'react'

interface SwipeConfig {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number // Minimum distance for swipe
  preventDefaultTouchmoveEvent?: boolean
}

interface TouchPosition {
  x: number
  y: number
}

export function useSwipeGestures(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = false
  } = config

  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null)
  const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null)

  // Calculate swipe distance and direction
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > threshold
    const isRightSwipe = distanceX < -threshold
    const isUpSwipe = distanceY > threshold
    const isDownSwipe = distanceY < -threshold

    // Determine if horizontal or vertical swipe is dominant
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)

    if (isHorizontalSwipe) {
      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      } else if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      if (isUpSwipe && onSwipeUp) {
        onSwipeUp()
      } else if (isDownSwipe && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Hook for pull-to-refresh functionality
export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = useRef(0)
  const currentY = useRef(0)
  const threshold = 80

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && startY.current > 0) {
      currentY.current = e.touches[0].clientY
      const distance = Math.max(0, currentY.current - startY.current)
      
      if (distance > 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    }
  }

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
    startY.current = 0
    currentY.current = 0
  }

  return {
    isRefreshing,
    pullDistance,
    pullToRefreshProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}

// Hook for swipe-to-delete/archive functionality
export function useSwipeActions<T>(
  items: T[],
  getId: (item: T) => string,
  actions: {
    onSwipeLeft?: (item: T) => void
    onSwipeRight?: (item: T) => void
  }
) {
  const [swipedItem, setSwipedItem] = useState<string | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)

  const createSwipeHandlers = (item: T) => {
    const itemId = getId(item)
    
    return useSwipeGestures({
      onSwipeLeft: () => {
        setSwipedItem(itemId)
        setSwipeOffset(-100)
        actions.onSwipeLeft?.(item)
      },
      onSwipeRight: () => {
        setSwipedItem(itemId)
        setSwipeOffset(100)
        actions.onSwipeRight?.(item)
      },
      threshold: 50
    })
  }

  const resetSwipe = () => {
    setSwipedItem(null)
    setSwipeOffset(0)
  }

  return {
    swipedItem,
    swipeOffset,
    createSwipeHandlers,
    resetSwipe
  }
}

