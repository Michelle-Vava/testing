# Error Handling Architecture

## Single Source of Truth

All error handling flows through **one predictable path**:

```
API Error → Axios Interceptor → Event Bus → Toast Display
          → useApiError hook → Component-specific handling
```

## The Layers
