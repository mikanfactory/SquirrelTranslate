import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWordSearch } from '../useWordSearch'

// Mock the API
const mockApi = {
  searchWord: vi.fn()
}

// Mock useApi hook
vi.mock('../useApi', () => ({
  useApi: () => mockApi
}))

describe('useWordSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWordSearch())

    expect(result.current.inputWord).toBe('')
    expect(result.current.searchResults).toEqual([])
    expect(result.current.isSearching).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should update input word', () => {
    const { result } = renderHook(() => useWordSearch())

    act(() => {
      result.current.setInputWord('猫')
    })

    expect(result.current.inputWord).toBe('猫')
  })

  it('should clear error', async () => {
    const mockErrorResult = {
      success: false,
      error: 'Test error'
    }

    mockApi.searchWord.mockResolvedValue(mockErrorResult)

    const { result } = renderHook(() => useWordSearch())

    // First cause an error
    await act(async () => {
      await result.current.searchWord('test')
    })

    expect(result.current.error).toBe('Test error')

    // Then clear it
    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
  })

  it('should perform successful word search', async () => {
    const mockSearchResult = {
      success: true,
      results: [
        {
          englishWord: 'cat',
          meaning: '猫科の動物',
          examples: ['The cat is sleeping. (猫が眠っている)']
        }
      ]
    }

    mockApi.searchWord.mockResolvedValue(mockSearchResult)

    const { result } = renderHook(() => useWordSearch())

    act(() => {
      result.current.setInputWord('猫')
    })

    let searchResult: any
    await act(async () => {
      searchResult = await result.current.searchWord('猫')
    })

    expect(result.current.isSearching).toBe(false)
    expect(result.current.searchResults).toEqual(mockSearchResult.results)
    expect(result.current.error).toBeNull()
    expect(searchResult).toBeDefined()
    expect(searchResult.japaneseWord).toBe('猫')
    expect(searchResult.results).toEqual(mockSearchResult.results)
    expect(mockApi.searchWord).toHaveBeenCalledWith('猫')
  })

  it('should handle search error', async () => {
    const mockErrorResult = {
      success: false,
      error: 'API Error'
    }

    mockApi.searchWord.mockResolvedValue(mockErrorResult)

    const { result } = renderHook(() => useWordSearch())

    act(() => {
      result.current.setInputWord('テスト')
    })

    let searchResult: any
    await act(async () => {
      searchResult = await result.current.searchWord('テスト')
    })

    expect(result.current.isSearching).toBe(false)
    expect(result.current.searchResults).toEqual([])
    expect(result.current.error).toBe('API Error')
    expect(searchResult).toBeNull()
  })

  it('should handle API exception', async () => {
    mockApi.searchWord.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useWordSearch())

    let searchResult: any
    await act(async () => {
      searchResult = await result.current.searchWord('テスト')
    })

    expect(result.current.isSearching).toBe(false)
    expect(result.current.searchResults).toEqual([])
    expect(result.current.error).toBe(
      '単語検索中にエラーが発生しました。APIキーが設定されているか確認してください。'
    )
    expect(searchResult).toBeNull()
  })

  it('should not search with empty word', async () => {
    const { result } = renderHook(() => useWordSearch())

    let searchResult: any
    await act(async () => {
      searchResult = await result.current.searchWord('')
    })

    expect(result.current.error).toBeNull() // Empty word doesn't set error
    expect(searchResult).toBeNull()
    expect(mockApi.searchWord).not.toHaveBeenCalled()
  })

  it('should set loading state during search', async () => {
    let resolveSearch: (value: any) => void
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve
    })

    mockApi.searchWord.mockReturnValue(searchPromise)

    const { result } = renderHook(() => useWordSearch())

    // Start search - don't wait for it to complete
    const searchPromiseCall = result.current.searchWord('猫')

    // Check loading state immediately
    expect(result.current.isSearching).toBe(true)

    // Resolve the search
    resolveSearch!({
      success: true,
      results: [
        {
          englishWord: 'cat',
          meaning: '猫科の動物',
          examples: []
        }
      ]
    })

    // Wait for search to complete
    await act(async () => {
      await searchPromiseCall
    })

    expect(result.current.isSearching).toBe(false)
  })
})
