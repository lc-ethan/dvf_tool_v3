import buMappingCsv from '../data/bu_mapping.csv?raw';
import journeyMappingCsv from '../data/journey_mapping.csv?raw';
import agentTypeMappingCsv from '../data/agent_type_mapping.csv?raw';
import agentClassMappingCsv from '../data/agent_class_mapping.csv?raw';
import agentNamesCsv from '../data/agent_names.csv?raw';
import jobTitlesCsv from '../data/agent_job_title_sf.csv?raw';
import hrListCsv from '../data/hr_list.csv?raw';
import type { HRPerson } from '../types';

const parseCsv = (csv: string) => {
  const [header, ...rows] = csv.trim().split('\n');
  const keys = header.split(',');
  
  return rows.reduce((acc, row) => {
    const values = row.split(',');
    acc[values[0]] = values[1];
    return acc;
  }, {} as Record<string, string>);
};

const parseNames = (csv: string): string[] => {
  const [_header, ...rows] = csv.trim().split('\n');
  return rows.map(row => row.trim());
};

const parseJobTitles = (csv: string): string[] => {
  const [_header, ...rows] = csv.trim().split('\n');
  return rows
    .map(row => row.trim())
    .filter(title => title); // Remove empty titles
};

const parseHRList = (csv: string): HRPerson[] => {
  const [header, ...rows] = csv.trim().split('\n');
  return rows.map(row => {
    const [name, email] = row.split(',').map(value => value.trim());
    return { name, email };
  });
};

export const BU_MAPPING = parseCsv(buMappingCsv);
export const JOURNEY_MAPPING = parseCsv(journeyMappingCsv);
export const AGENT_TYPE_MAPPING = parseCsv(agentTypeMappingCsv);
export const AGENT_CLASS_MAPPING = parseCsv(agentClassMappingCsv);
export const AGENT_NAMES = parseNames(agentNamesCsv);
export const JOB_TITLES = parseJobTitles(jobTitlesCsv);
export const HR_LIST = parseHRList(hrListCsv);

// Reverse mappings for display purposes
export const JOURNEY_DISPLAY_MAPPING = Object.entries(JOURNEY_MAPPING).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<string, string>);

export const AGENT_TYPE_DISPLAY_MAPPING = Object.entries(AGENT_TYPE_MAPPING).reduce((acc, [key, value]) => {
  acc[key] = value;
  return acc;
}, {} as Record<string, string>);