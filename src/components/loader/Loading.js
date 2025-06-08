import { Flex, Spin } from 'antd';
import * as React from 'react';

export default function Loading() {
    return (
        <Flex align="center" gap="middle">
            <Spin />
        </Flex>
    );
}
