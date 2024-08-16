import React, { ReactNode, useState } from 'react';
import ConfigCard from './Card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  getFocusedNodeId,
  getFocusedSchema,
  updateGraphNode,
} from '@/redux/designer/slice/graphSlice';
import _ from 'lodash';

import 'react-resizable/css/styles.css';

const CONFIG = 'Config';
const DEPLOY = 'Deploy';

interface TabProps {
  isActive: boolean;
  title: string;
  onClick: () => void;
}

function Tab({ isActive, title, onClick }: TabProps) {
  return (
    <div
      className="w-15 h-10 flex justify-center items-center cursor-pointer"
      onClick={onClick}
    >
      <span className={`text-xs ${isActive ? 'text-white' : 'text-textGrey'}`}>
        {title}
      </span>
    </div>
  );
}

interface TabContentProps {
  isActive: boolean;
  children: ReactNode;
}

function TabContent({ isActive, children }: TabContentProps) {
  return (
    <div
      className={`w-full flex-auto flex flex-col overflow-y-auto ${
        isActive ? '' : 'hidden'
      }`}
    >
      {children}
    </div>
  );
}

function Configuration() {
  const [activeTab, setActiveTab] = useState<string>(CONFIG);

  const dispatch = useAppDispatch();
  const focusedNodeId = useAppSelector(getFocusedNodeId);
  const focusedSchema = useAppSelector(getFocusedSchema);
  if (!focusedNodeId || !focusedSchema) {
    return;
  }

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {/* Title */}
      <div className="w-full flex flex-row justify-start text-stratusPurple text-base border-b border-figmaBorder pb-1">
        <div className="w-2" />
        {focusedSchema.id}
      </div>
      {/* Tab Headers */}
      <div className="w-full flex flex-row justify-start border-b border-figmaBorder">
        <div className="w-2" />
        <Tab
          isActive={CONFIG === activeTab}
          title={CONFIG}
          onClick={() => setActiveTab(CONFIG)}
        />
        <div className="w-4" />
        <Tab
          isActive={DEPLOY === activeTab}
          title={DEPLOY}
          onClick={() => setActiveTab(DEPLOY)}
        />
      </div>
      {/* Tab Content */}
      <TabContent isActive={CONFIG === activeTab}>
        {Object.keys(focusedSchema.config)
          .filter((property) => {
            return focusedSchema.config[property]?.hidden !== true;
          })
          .map((property: string) => {
            return (
              <ConfigCard
                key={`${focusedSchema.id}-${property}`}
                schemaProperty={focusedSchema.config[property]}
                onChange={(value) => {
                  const focusedSchemaCopy = _.cloneDeep(focusedSchema);
                  focusedSchemaCopy.config[property].value = value;
                  dispatch(
                    updateGraphNode({
                      nodeId: focusedNodeId,
                      updatedSchema: focusedSchemaCopy,
                    })
                  );
                }}
              />
            );
          })}
      </TabContent>
      <TabContent isActive={DEPLOY === activeTab}>
        {Object.keys(focusedSchema.deploy).map((property: string) => {
          return (
            <ConfigCard
              key={`${focusedSchema.id}-${property}`}
              schemaProperty={focusedSchema.deploy[property]}
              onChange={(value) => {
                const focusedSchemaCopy = _.cloneDeep(focusedSchema);
                focusedSchemaCopy.deploy[property].value = value;
                dispatch(
                  updateGraphNode({
                    nodeId: focusedNodeId,
                    updatedSchema: focusedSchemaCopy,
                  })
                );
              }}
            />
          );
        })}
      </TabContent>
    </div>
  );
}

export default Configuration;
