import React, {
  useState,
  useCallback,
} from 'react';
import { 
  LegacyForms,
  Select,
  PanelOptionsGroup,
  InlineFormLabel,
} from '@grafana/ui';
import { 
  QueryEditorProps,
  SelectableValue,
  DataSourceApi,
} from '@grafana/data';
import { 
  DataSource,
  getItems,
} from './DataSource';
import { 
  PrtgDataSourceOptions,
  PrtgQuery,
  methodList,
  tableOptions,
  messageColumns,
  defaultColumns,
  deviceColumns,
  probeColumns,
  groupColumns,
  sensorColumns,
  defaultPrtgQuery,
  messageFilterDrelList,
} from './types';
import { getDataSourceSrv } from '@grafana/runtime'
import defaults from 'lodash/defaults'
const { FormField } = LegacyForms;

type PrtgProps = QueryEditorProps<DataSource, PrtgQuery, PrtgDataSourceOptions>;

export function PrtgQueryEditor (Props:PrtgProps){
  const {onChange,query,onRunQuery} = Props
  const defaultedQuery = defaults(query,defaultPrtgQuery)

  const updateQuery = useCallback(
    (key,value) => {
      onChange({
        ...defaultedQuery,
        [key]:value
      })
      onRunQuery()
    },
    [defaultedQuery]
  )
 
  return (
    <section>
      <SelectRender  queryKey={"queryMethod"} selectOptions={methodList} changeFunc={updateQuery} currentValue={defaultedQuery.queryMethod} isMulti={false}></SelectRender>
      <PanelOptionsGroup>
        <PrtgQueryEditorHelper updateQuery={updateQuery} query={defaultedQuery}/>
      </PanelOptionsGroup>
    </section>
  );
}; 

const PrtgQueryEditorHelper = ({updateQuery,query}:any) => {
  const RenderAllGroupsSelect:any = <SelectRender queryKey={"selectedGroup"} selectOptions={getItemsFromDataSource("groups","0",["name","objid"])} changeFunc={updateQuery} currentValue={query.selectedGroup} isMulti={false}></SelectRender>

  switch (query.queryMethod.value) {
    case "table":
      return(
        <section style={{display:"flex",flexDirection:"row"}}>
          <InlineFormLabel width={"auto"}>{"Content:"}</InlineFormLabel>
          <SelectRender queryKey={"tableOption"} selectOptions={tableOptions} changeFunc={updateQuery} currentValue={query.tableOption} isMulti={false}></SelectRender>
          <InlineFormLabel width={"auto"}>{"From:"}</InlineFormLabel>
          {RenderAllGroupsSelect}
          <FilterRender query={query} updateQuery={updateQuery}/>
          <InlineFormLabel width={"auto"}>{"Columns:"}</InlineFormLabel>
          <SelectRender queryKey={"tableColumnItems"} selectOptions={getTableColumnOptions(query)} changeFunc={updateQuery} currentValue={query.tableColumnItems} isMulti={true}></SelectRender>
        </section>
      );  
    case "historicdata":
      return(
        <section style={{display:"flex",flexDirection:"row"}}>
          <InlineFormLabel width={"auto"}>{"Group:"}</InlineFormLabel>
          {RenderAllGroupsSelect}
          <InlineFormLabel width={"auto"}>{"Device:"}</InlineFormLabel>
          <SelectRender queryKey={"selectedDevice"} selectOptions={getItemsFromDataSource("devices",query.selectedGroup.value,["name","objid"])} changeFunc={updateQuery} currentValue={query.selectedDevice} isMulti={false}></SelectRender>
          <InlineFormLabel width={"auto"}>{"Sensor:"}</InlineFormLabel>
          <SelectRender queryKey={"selectedSensor"} selectOptions={getItemsFromDataSource("sensors",query.selectedDevice.value,["name","objid"])} changeFunc={updateQuery} currentValue={query.selectedSensor} isMulti={false}></SelectRender>
        </section>
      );
    case "raw":
      return(
        <section style={{display:"flex",flexDirection:"row"}}> 
          <FormField value={query.rawURI} label={"URI: "} onChange={(e) => updateQuery("rawURI",e.target.value)}></FormField>
          <FormField value={query.rawQuerytext} label={"Query text: "} onChange={(e) => updateQuery("rawQuerytext",e.target.value)}></FormField>
        </section>
      );
    case "status":
      return(
      <section>{"no edit optios for status request"}</section>
      )
    default:
      return(
        <section></section>
      );
  }
}

const FilterRender = ({query,updateQuery}:any) => {
  if(query.tableOption.value === "message"){
    return(
      <section>
        <InlineFormLabel width={"auto"}>{"Filter:"}</InlineFormLabel>
        <SelectRender queryKey={"messageFilterDrel"} selectOptions={messageFilterDrelList} changeFunc={updateQuery} currentValue={query.messageFilterDrel} isMulti={false}></SelectRender>
      </section>
    );
  }
  else{
    return(
      <section/>
    );
  }
}

const SelectRender =({queryKey,selectOptions,changeFunc,currentValue,isMulti}:any) => {
  const [selected,setSelected] = useState(currentValue)
  return (
  <div>
    <Select isMulti={isMulti} options={selectOptions} onChange={(e) => (changeFunc(queryKey,e),setSelected(e))} value={selected}/>
  </div>
  )
};

const getTableColumnOptions = (query:any) => {
  var ColOpt:SelectableValue[] = defaultColumns
  switch (query.tableOption.value) {
    case "sensor":
      ColOpt = [...ColOpt,...sensorColumns]
      break;
    case "group":
      ColOpt = [...ColOpt,...groupColumns]
      break;
    case "device":
      ColOpt = [...ColOpt,...deviceColumns]
      break;
    case "probe":
      ColOpt = [...ColOpt,...probeColumns]
      break;
    case "message":
      ColOpt = messageColumns
      break;
    default:
      break;      
  }
  return ColOpt;
} 

const getItemsFromDataSource = (contentInput:string,idInput:string,columnsInput:string[]):SelectableValue[] => {
  const selects:SelectableValue[] = getGrafVars()
  getItems({content:contentInput,id:idInput,columns:columnsInput}).then((apiRes:any) => {
    apiRes.map((itemElement:any) => {
      selects.push(
        {
          label:itemElement.item,
          value:itemElement.objid
        }
      )
    })
  })
  return selects
}

const getGrafVars = ():SelectableValue[] => {
  var dataSource:any = getDataSourceSrv() as unknown as DataSourceApi;   
  const grafSelects:SelectableValue[] = []
  dataSource.templateSrv.variables.map((vari:any) => {
    grafSelects.push(
      {
        value: `$${vari.label}`,
        label: `$${vari.label}`
      }
    )
  })
  return grafSelects
}