import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchDeals, createDeal, updateDeal, updateDealStage, deleteDeal } from '@/api/deals'
import type { Deal, DealStage } from '@/types'

export const DEALS_KEY = ['deals'] as const

export function useDeals() {
  return useQuery({
    queryKey: DEALS_KEY,
    queryFn: fetchDeals,
  })
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEALS_KEY }),
  })
}

export function useUpdateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Deal> }) =>
      updateDeal(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEALS_KEY }),
  })
}

export function useUpdateDealStage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: DealStage }) =>
      updateDealStage(id, stage),
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: DEALS_KEY })
      const previous = queryClient.getQueryData<Deal[]>(DEALS_KEY)
      queryClient.setQueryData<Deal[]>(DEALS_KEY, (old) =>
        old?.map((d) => (d.id === id ? { ...d, stage } : d)) ?? []
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(DEALS_KEY, ctx.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: DEALS_KEY }),
  })
}

export function useDeleteDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: DEALS_KEY }),
  })
}
