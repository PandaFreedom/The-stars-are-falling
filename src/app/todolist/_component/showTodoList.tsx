"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import React from 'react';

function ShowTodoList() {
    // 使用useQueryClient获取当前上下文中的queryClient实例
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['todolist'],
        queryFn: () => fetch('http://localhost:3001/api/todolist/get').then(res => {
            if (!res.ok) {
                throw new Error('获取数据失败');
            }
            return res.json();
        }),
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 0, // 始终认为数据是陈旧的，这样在invalidateQueries后会触发重新获取
    });

    const mutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await fetch(`http://localhost:3001/api/todolist/delete`, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('删除失败');
            }
            console.log(`删除ID: ${id}的任务成功`);
        },
        onSuccess: async () => {
            console.log('删除成功，正在刷新数据...');
            // 使用await确保操作完成
            await queryClient.invalidateQueries({ queryKey: ['todolist'] });
            // 强制刷新数据
            await refetch();
            console.log('数据刷新完成');
        },
        onError: (error) => {
            console.error('删除失败:', error);
        }
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!data || data.length === 0) return <div>暂无待办事项</div>;

    const handleDelete = (id: number) => {
        mutation.mutate(id);
    };

    return (
        <div>
            {/* 渲染从API获取的数据 */}
            {data.map((item: { id: number; title: string; description: string; status: string }) => (
                <div key={`todo-${item.id}`} className="mb-4 flex justify-between flex-row items-center gap-4 border-2 border-blue-100 p-4">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <p
                        className={`text-sm ${
                            item.status === '已完成' ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                        {item.status}
                    </p>
                    <Button type="primary" danger onClick={() => handleDelete(item.id)}>
                        删除
                    </Button>
                </div>
            ))}
        </div>
    );
}

export default ShowTodoList;
