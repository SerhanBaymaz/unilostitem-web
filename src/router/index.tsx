import React from 'react';
import type { RouteObject } from 'react-router';
import { createBrowserRouter, Navigate } from 'react-router';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import { AdminRoute, ProtectedRoute } from '@/shared/components';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ItemDetailPage = React.lazy(() => import('@/pages/ItemDetailPage'));
const ItemCreatePage = React.lazy(() => import('@/pages/ItemCreatePage'));
const ItemEditPage = React.lazy(() => import('@/pages/ItemEditPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const MyItemsPage = React.lazy(() => import('@/pages/MyItemsPage'));
const MyClaimsPage = React.lazy(() => import('@/pages/MyClaimsPage'));
const ClaimDetailPage = React.lazy(() => import('@/pages/ClaimDetailPage'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminClaims = React.lazy(() => import('@/pages/admin/AdminClaims'));
const AdminItems = React.lazy(() => import('@/pages/admin/AdminItems'));

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/items',
        element: <Navigate to="/" replace />,
      },
      {
        path: '/items/:id',
        element: <ItemDetailPage />,
      },
      {
        path: '/claims/:id',
        element: <ClaimDetailPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/items/new',
            element: <ItemCreatePage />,
          },
          {
            path: '/items/:id/edit',
            element: <ItemEditPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/my-items',
            element: <MyItemsPage />,
          },
          {
            path: '/my-claims',
            element: <MyClaimsPage />,
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: '/admin',
                element: <AdminDashboard />,
              },
              {
                path: '/admin/claims',
                element: <AdminClaims />,
              },
              {
                path: '/admin/items',
                element: <AdminItems />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/404',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export const router = createBrowserRouter(routes);
