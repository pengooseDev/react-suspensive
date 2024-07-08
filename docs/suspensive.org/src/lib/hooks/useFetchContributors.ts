import { useEffect, useState } from 'react'
import type { GithubRepoContributor } from '../../types'

type Result =
  | {
      isLoading: false
      isSuccess: true
      isError: false
      data: GithubRepoContributor[]
      error: undefined
    }
  | {
      isLoading: false
      isSuccess: false
      isError: true
      data: undefined
      error: Error
    }
  | {
      isLoading: true
      isSuccess: false
      isError: false
      data: undefined
      error: undefined
    }

const useFetchContributors = () => {
  const [result, setResult] = useState<Result>({
    isSuccess: false,
    data: undefined,
    error: undefined,
    isError: false,
    isLoading: true,
  })

  useEffect(() => {
    async function fetchContributors(): Promise<void> {
      try {
        const response = await fetch('https://api.github.com/repos/toss/suspensive/stats/contributors')
        if (!response.ok) {
          throw new Error('Failed to fetch contributors')
        }
        const data: GithubRepoContributor[] = (await response.json()) as GithubRepoContributor[]

        if (!Array.isArray(data)) {
          throw new Error('Github contributors data is not an array')
        }

        if (data.length === 0) {
          console.log('Github contributors data is empty')
        }

        const filteredContributors = data.filter((contributor) => {
          const login = contributor.author.login
          return !['github-actions[bot]', 'dependabot[bot]', 'renovate[bot]'].includes(login)
        })

        setResult({
          data: filteredContributors,
          error: undefined,
          isError: false,
          isLoading: false,
          isSuccess: true,
        })
      } catch (error) {
        console.error('Error fetching contributors:', error)
        setResult({
          data: undefined,
          error: error as Error,
          isError: true,
          isLoading: false,
          isSuccess: false,
        })
      }
    }

    void fetchContributors()
  }, [])

  return result
}

export default useFetchContributors
