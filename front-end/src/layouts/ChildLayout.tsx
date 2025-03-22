import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import '../styles/layouts/child.scss';

interface ChildLayoutProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

const ChildLayout = ({ title, description, children }: ChildLayoutProps) => {
  return (
    <div className="child-layout">
      {/* Page Header */}
      {(title || description) && (
        <div className="bg-white shadow-sm mb-6">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {title && <h1 className="text-3xl font-bold text-gray-900">{title}</h1>}
            {description && <p className="mt-2 text-sm text-gray-700">{description}</p>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default ChildLayout; 