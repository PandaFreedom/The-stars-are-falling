import { useQuery } from '@tanstack/react-query';
import React from 'react';

function TodoList() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['todos'],
        queryFn: () => fetch('http://localhost:3001/api/zoo').then(res => res.json())
    });
    console.log(data);

    if (isLoading) {
        return <div className="text-center text-lg font-semibold">加载中...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">错误: {error.message}</div>;
    }
    return (
        <div className="flex flex-col items-center w-full ">
            {data?.map((item: any) => (
                <div key={item.id} className='bg-white shadow-md rounded-lg p-4 mb-4 w-1/2 mx-auto flex flex-col items-center justify-center gap-2'>
                    <p className="text-xl font-bold">{item.name}</p>
                    <p className="text-gray-600">年龄: {item.age}</p>
                </div>
            ))}
        </div>
    );
}

export default TodoList;
