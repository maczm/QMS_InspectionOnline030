<template>
  <div class="home">
    <div class="collapse-container">
      <!-- 顶部固定区域 - 始终显示 -->
      <div class="fixed-section">
        <div class="fixed-content">
          <!-- 右侧：当前订单输入框和折叠按钮 -->
          <div class="right-panel">
            <div class="order-input">
              <el-input v-model="currentOrder" size="small" class="order-field">
                <el-button
                  slot="append"
                  style="margin-right: 5px"
                  icon="el-icon-search"
                  @click="handleOrderSearch"
                ></el-button>
                <el-button
                  slot="append"
                  icon="el-icon-full-screen"
                  @click="onCamera('wipOrderNo')"
                  v-if="isApp"
                >
                </el-button>
              </el-input>
            </div>

            <div class="toggle-icon" @click="toggleCollapse">
              <i
                :class="isCollapsed ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <!-- 可折叠区域 -->
      <transition name="slide">
        <div class="collapsible-section" v-show="!isCollapsed">
          <div class="collapsible-content">
            <!-- 左侧：机型编码 -->
            <div class="left-panel">
              <div class="model-code-section">
                <div class="section-title">机型编码</div>
                <div class="model-code" v-if="modelCode">{{ modelCode }}</div>
                <div class="no-data" v-else>暂无机型编码</div>
              </div>
            </div>
            <!-- 右侧：输入框区域 -->
            <div class="right-panel">
              <div class="input-section">
                <div class="input-row">
                  <div class="input-label">月顺序号</div>
                  <el-input
                    v-model="monthlySequence"
                    size="small"
                    class="input-field"
                  >
                    <el-button
                      slot="append"
                      style="margin-right: 5px"
                      icon="el-icon-search"
                      @click="handleMonthlySequenceSearch"
                    >
                    </el-button>
                    <el-button
                      slot="append"
                      icon="el-icon-full-screen"
                      @click="onCamera('monthSequence')"
                      v-if="isApp"
                    >
                    </el-button>
                  </el-input>
                </div>

                <div class="input-row">
                  <div class="input-label">车架号</div>
                  <el-input
                    v-model="frameNumber"
                    size="small"
                    class="input-field"
                  >
                    <el-button
                      slot="append"
                      style="margin-right: 5px"
                      icon="el-icon-search"
                      @click="handleFrameNumberSearch"
                    >
                    </el-button>
                    <el-button
                      slot="append"
                      icon="el-icon-full-screen"
                      @click="onCamera('vin')"
                      v-if="isApp"
                    >
                    </el-button>
                  </el-input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 新增部分：单据状态和检验结果 -->
    <div class="inspection-container" v-show="inspectionList.length !== 0">
      <!-- 单据状态行 -->
      <div class="document-status">
        <div class="status-item">
          <span class="status-label">单据状态：</span>
          <span class="status-value">{{ documentStatus }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">单据检验结果：</span>
          <span class="status-value">{{ inspectionResult }}</span>
        </div>
      </div>

      <!-- 检验项区域 -->
      <div class="problem-section">
        <div class="section-header">
          <span class="section-title">检验项</span>
          <el-radio-group v-model="showIsConfirm" size="small">
            <el-radio-button label="0">未关闭</el-radio-button>
            <el-radio-button label="1">已关闭</el-radio-button>
          </el-radio-group>
        </div>
        <div class="problem-list">
          <div
            v-for="(inspection, index) in filteredInspectionList"
            :key="inspection.dispositionId"
            class="problem-item"
            @click="
              (customDisable(inspection) ||
                inspection.testAttribute === 'OK') === false
                ? handleOpenDialog(inspection, index, 'inspection')
                : null
            "
          >
            <div class="problem-content">
              <div class="problem-row">
                <span class="problem-label">检验项{{ index + 1 }}：</span>
                <el-input
                  v-model="inspection.dispositionDesc"
                  class="problem-input"
                  type="textarea"
                  autosize
                  disabled
                >
                </el-input>
              </div>
              <div class="problem-row">
                <span class="problem-label">描述：</span>
                <el-input
                  v-model="inspection.dxDesc"
                  class="problem-input"
                  type="textarea"
                  autosize
                  disabled
                >
                </el-input>
              </div>
              <div
                class="problem-row"
                v-if="inspection.fileList && inspection.fileList.length > 0"
              >
                <span class="problem-label">文件：</span>
                <div class="file-list">
                  <div
                    v-for="(file, fileIndex) in inspection.fileList"
                    :key="fileIndex"
                    class="file-item"
                    @click.stop="handleFilePreview(file)"
                  >
                    <i :class="getFileIcon(file.name)"></i>
                    <span class="file-name">{{ file.name }}</span>
                  </div>
                </div>
              </div>
              <!--检验结论-->
              <div class="problem-row">
                <span class="problem-label">检验结论：</span>
                <div class="radio-group-container">
                  <el-radio-group
                    disabled
                    v-model="inspection.testAttribute"
                    size="small"
                  >
                    <el-radio label="OK">OK</el-radio>
                    <el-radio label="NG">NG</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <!-- 检验人 -->
              <div class="problem-row">
                <span class="problem-label">检验人：</span>
                <el-input
                  v-model="inspection.testBy"
                  class="problem-input"
                  disabled
                >
                </el-input>
              </div>
              <!-- 是否处置 -->
              <div class="problem-row" v-if="inspection.testAttribute === 'NG'">
                <span class="problem-label">是否处置：</span>
                <div class="radio-group-container">
                  <el-radio-group
                    v-model="inspection.isHandle"
                    size="small"
                    disabled
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <!-- 处置人 -->
              <div class="problem-row" v-if="inspection.testAttribute === 'NG'">
                <span class="problem-label">处置人：</span>
                <el-input
                  v-model="inspection.handleBy"
                  class="problem-input"
                  disabled
                >
                </el-input>
              </div>
              <!-- 处置措施 -->
              <div class="problem-row" v-if="inspection.testAttribute === 'NG'">
                <span class="problem-label">处置措施：</span>
                <el-input
                  v-model="inspection.handleReMark"
                  class="problem-input"
                  type="textarea"
                  autosize
                  disabled
                >
                </el-input>
              </div>
              <!-- 是否关闭 -->
              <div class="problem-row" v-if="inspection.testAttribute === 'NG'">
                <span style="color: #409eff" class="problem-label"
                  >是否关闭：</span
                >
                <div class="radio-group-container">
                  <el-radio-group
                    v-model="inspection.isClose"
                    size="small"
                    @change="handleInspectionIsCloseChange(inspection)"
                    :disabled="customDisable(inspection)"
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <!-- 确认备注 -->
              <div class="problem-row" v-if="inspection.testAttribute === 'NG'">
                <span style="color: #409eff" class="problem-label"
                  >确认备注：</span
                >
                <el-input
                  v-model="inspection.confirmReMark"
                  class="problem-input"
                  type="textarea"
                  autosize
                  v-keyboard-focus
                  :disabled="customDisable(inspection)"
                >
                </el-input>
              </div>
              <!-- 确认人 -->
              <div class="problem-row" v-if="inspection.testAttribute === 'NG'">
                <span style="color: #409eff" class="problem-label"
                  >确认人：</span
                >
                <el-input
                  disabled
                  v-model="inspection.confirmBy"
                  class="problem-input"
                >
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 问题区域 -->
      <div class="problem-section">
        <div class="section-header">
          <span class="section-title">问题</span>
        </div>
        <div class="problem-list">
          <div
            v-for="(problem, index) in filteredProblemList"
            :key="problem.questionId"
            class="problem-item"
            @click="
              customDisable(problem) === false
                ? handleOpenDialog(problem, index, 'problem')
                : null
            "
          >
            <div class="problem-content">
              <div class="problem-row">
                <span class="problem-label">问题{{ index + 1 }}：</span>
                <el-input
                  v-model="problem.question"
                  class="problem-input"
                  type="textarea"
                  autosize
                  disabled
                >
                </el-input>
              </div>
              <!-- 图片展示区域 -->
              <div class="problem-row">
                <span class="problem-label">检验图片：</span>
                <div class="image-display-section">
                  <div class="image-display-container">
                    <div class="image-list-horizontal">
                      <div
                        v-for="(image, imgIndex) in problem.imageList"
                        :key="imgIndex"
                        class="image-item"
                        @click="handlePictureCardPreview(image)"
                      >
                        <img
                          :src="image.url"
                          :alt="image.name"
                          class="displayed-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 检验人 -->
              <div class="problem-row">
                <span class="problem-label">检验人：</span>
                <el-input
                  v-model="problem.testBy"
                  class="problem-input"
                  disabled
                >
                </el-input>
              </div>
              <!-- 责任班组 -->
              <div class="problem-row">
                <span class="problem-label">责任班组：</span>
                <el-select
                  v-model="problem.respTeam"
                  filterable
                  disabled
                  size="small"
                >
                  <el-option
                    v-for="item in respTeamOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <!-- 责任人 -->
              <div class="problem-row">
                <span class="problem-label">责任人：</span>
                <el-input
                  v-model="problem.respEmployee"
                  class="problem-input"
                  disabled
                  type="textarea"
                  autosize
                >
                </el-input>
              </div>
              <!-- 是否处置 -->
              <div class="problem-row">
                <span class="problem-label">是否处置：</span>
                <div class="radio-group-container">
                  <el-radio-group
                    v-model="problem.isHandle"
                    size="small"
                    disabled
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <!-- 处置人 -->
              <div class="problem-row">
                <span class="problem-label">处置人：</span>
                <el-input
                  v-model="problem.handleBy"
                  class="problem-input"
                  disabled
                >
                </el-input>
              </div>
              <!-- 处置措施 -->
              <div class="problem-row">
                <span class="problem-label">处置措施：</span>
                <el-input
                  v-model="problem.handleReMark"
                  class="problem-input"
                  type="textarea"
                  autosize
                  disabled
                >
                </el-input>
              </div>
              <!-- 处置图片展示区域 -->
              <div class="problem-row">
                <span class="problem-label">处置图片：</span>
                <div class="image-display-section">
                  <div class="image-display-container">
                    <div class="image-list-horizontal">
                      <div
                        v-for="(image, imgIndex) in problem.handImageList"
                        :key="imgIndex"
                        class="image-item"
                        @click="handlePictureCardPreview(image)"
                      >
                        <img
                          :src="image.url"
                          :alt="image.name"
                          class="displayed-image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 是否关闭 -->
              <div class="problem-row">
                <span style="color: #409eff" class="problem-label"
                  >是否关闭：</span
                >
                <div class="radio-group-container">
                  <el-radio-group
                    v-model="problem.isClose"
                    size="small"
                    @change="handleIsCloseChange(problem)"
                    :disabled="
                      originalData.orderStatus === 3 || problem.isHandle !== 1
                    "
                  >
                    <el-radio :label="0">否</el-radio>
                    <el-radio :label="1">是</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <!-- 确认备注 -->
              <div class="problem-row">
                <span style="color: #409eff" class="problem-label"
                  >确认备注：</span
                >
                <el-input
                  v-model="problem.confirmReMark"
                  class="problem-input"
                  type="textarea"
                  autosize
                  v-keyboard-focus
                  :disabled="customDisable(problem)"
                >
                </el-input>
              </div>
              <!-- 确认图片 -->
              <div class="problem-row">
                <span style="color: #409eff" class="problem-label"
                  >确认图片：</span
                >
                <div class="image-upload-section">
                  <div class="image-upload-container">
                    <!-- 移动端上传按钮 -->
                    <!-- <div class="mobile-upload-btn" @click="handleMobileUpload(problem.questionId)"> -->
                    <!--   <i class="el-icon-plus"></i> -->
                    <!--   <div class="upload-text">添加图片</div> -->
                    <!-- </div> -->
                    <!-- 图片列表水平滚动 -->
                    <div class="image-scroll-container">
                      <div class="image-list-horizontal">
                        <div
                          v-for="(image, imgIndex) in problem.confirmImageList"
                          :key="imgIndex"
                          class="image-item"
                          @click="handleConfirmPictureCardPreview(image)"
                        >
                          <img
                            :src="image.url"
                            :alt="image.name"
                            class="uploaded-image"
                          />
                          <div class="image-actions">
                            <i
                              class="el-icon-delete"
                              v-if="!customDisable(problem)"
                              @click.stop="
                                removeSingleConfirmImage(problem, imgIndex)
                              "
                            >
                            </i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="image-count">
                    {{ problem.confirmImageList.length }}/30
                  </div>
                </div>
              </div>
              <!-- 确认人 -->
              <div class="problem-row">
                <span style="color: #409eff" class="problem-label"
                  >确认人：</span
                >
                <el-input
                  disabled
                  v-model="problem.confirmBy"
                  class="problem-input"
                >
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部固定按钮 -->
    <div class="fixed-action-buttons">
      <el-button type="primary" @click="submit" class="submit-btn"
        >提交</el-button
      >
    </div>
    <!-- 图片预览对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      fullscreen
      @close="resetPreviewTransform"
    >
      <div class="image-preview-container" @wheel.prevent="handleWheel">
        <img
          ref="previewImage"
          :src="dialogImageUrl"
          alt=""
          class="preview-image"
          :style="previewImageStyle"
          @load="onImageLoad"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        />
      </div>
      <div class="image-preview-toolbar">
        <button @click="zoomIn" class="toolbar-btn">+</button>
        <button @click="zoomOut" class="toolbar-btn">-</button>
        <button @click="resetPreviewTransform" class="toolbar-btn">1:1</button>
        <button @click="fitPreviewImage" class="toolbar-btn">适应</button>
      </div>
    </el-dialog>
    <!-- 检验项编辑对话框 -->
    <el-dialog
      :visible.sync="dialogTestVisible"
      :append-to-body="true"
      fullscreen
      :showClose="true"
      style="padding: 0"
    >
      <div class="problem-row">
        <span class="problem-label">检验项{{ dialogIndex + 1 }}：</span>
        <el-input
          v-model="dialogTestData.dispositionDesc"
          class="problem-input"
          type="textarea"
          autosize
          disabled
        >
        </el-input>
      </div>
      <div class="problem-row">
        <span class="problem-label">描述：</span>
        <el-input
          v-model="dialogTestData.dxDesc"
          class="problem-input"
          type="textarea"
          autosize
          disabled
        >
        </el-input>
      </div>
      <!--检验结论-->
      <div class="problem-row">
        <span class="problem-label">检验结论：</span>
        <div class="radio-group-container">
          <el-radio-group
            disabled
            v-model="dialogTestData.testAttribute"
            size="small"
          >
            <el-radio label="OK">OK</el-radio>
            <el-radio label="NG">NG</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 检验人 -->
      <div class="problem-row">
        <span class="problem-label">检验人：</span>
        <el-input
          v-model="dialogTestData.testBy"
          class="problem-input"
          disabled
        >
        </el-input>
      </div>
      <!-- 是否处置 -->
      <div class="problem-row">
        <span class="problem-label">是否处置：</span>
        <div class="radio-group-container">
          <el-radio-group
            v-model="dialogTestData.isHandle"
            size="small"
            disabled
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 处置人 -->
      <div class="problem-row">
        <span class="problem-label">处置人：</span>
        <el-input
          v-model="dialogTestData.handleBy"
          class="problem-input"
          disabled
        >
        </el-input>
      </div>
      <!-- 处置措施 -->
      <div class="problem-row">
        <span class="problem-label">处置措施：</span>
        <el-input
          v-model="dialogTestData.handleReMark"
          class="problem-input"
          type="textarea"
          autosize
          disabled
        >
        </el-input>
      </div>
      <!-- 是否关闭 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">是否关闭：</span>
        <div class="radio-group-container">
          <el-radio-group
            v-model="dialogTestData.isClose"
            size="small"
            @change="handleInspectionIsCloseChange(dialogTestData)"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 确认备注 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">确认备注：</span>
        <el-input
          v-model="dialogTestData.confirmReMark"
          class="problem-input"
          type="textarea"
          autosize
          v-keyboard-focus
        >
        </el-input>
      </div>
      <!-- 确认人 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">确认人：</span>
        <el-input
          disabled
          v-model="dialogTestData.confirmBy"
          class="problem-input"
        >
        </el-input>
      </div>
      <div class="fixed-action-buttons">
        <el-button
          type="primary"
          @click="handleCloseDialog('ConfirmInspection')"
          class="save-btn"
          >保存并返回
        </el-button>
      </div>
    </el-dialog>
    <!-- 问题项编辑对话框 -->
    <el-dialog
      :visible.sync="dialogProblemVisible"
      :append-to-body="true"
      fullscreen
      :showClose="true"
      style="padding: 0"
    >
      <div class="problem-row">
        <span class="problem-label">问题{{ dialogIndex + 1 }}：</span>
        <el-input
          v-model="dialogProblemData.question"
          class="problem-input"
          type="textarea"
          autosize
          disabled
        >
        </el-input>
      </div>
      <!-- 图片 -->
      <div class="problem-row">
        <span class="problem-label">检验图片：</span>
        <div class="image-display-section">
          <div class="image-display-container">
            <div class="image-list-horizontal">
              <div
                v-for="(image, imgIndex) in dialogProblemData.imageList"
                :key="imgIndex"
                class="image-item"
                @click="handlePictureCardPreview(image)"
              >
                <img
                  :src="image.url"
                  :alt="image.name"
                  class="displayed-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 检验人 -->
      <div class="problem-row">
        <span class="problem-label">检验人：</span>
        <el-input
          v-model="dialogProblemData.testBy"
          class="problem-input"
          disabled
        >
        </el-input>
      </div>
      <!-- 是否处置 -->
      <div class="problem-row">
        <span class="problem-label">是否处置：</span>
        <div class="radio-group-container">
          <el-radio-group
            v-model="dialogProblemData.isHandle"
            size="small"
            disabled
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 处置人 -->
      <div class="problem-row">
        <span class="problem-label">处置人：</span>
        <el-input
          v-model="dialogProblemData.handleBy"
          class="problem-input"
          disabled
        >
        </el-input>
      </div>
      <!-- 处置措施 -->
      <div class="problem-row">
        <span class="problem-label">处置措施：</span>
        <el-input
          v-model="dialogProblemData.handleReMark"
          class="problem-input"
          type="textarea"
          autosize
          disabled
        >
        </el-input>
      </div>
      <!-- 复检图片 -->
      <div class="problem-row">
        <span class="problem-label">处置图片：</span>
        <div class="image-display-section">
          <div class="image-display-container">
            <div class="image-list-horizontal">
              <div
                v-for="(image, imgIndex) in dialogProblemData.handImageList"
                :key="imgIndex"
                class="image-item"
                @click="handlePictureCardPreview(image)"
              >
                <img
                  :src="image.url"
                  :alt="image.name"
                  class="displayed-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 是否关闭 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">是否关闭：</span>
        <div class="radio-group-container">
          <el-radio-group
            v-model="dialogProblemData.isClose"
            size="small"
            @change="handleIsCloseChange(dialogProblemData)"
          >
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 确认备注 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">确认备注：</span>
        <el-input
          v-model="dialogProblemData.confirmReMark"
          class="problem-input"
          type="textarea"
          autosize
          v-keyboard-focus
        >
        </el-input>
      </div>
      <!-- 确认图片 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">确认图片：</span>
        <div class="image-upload-section">
          <div class="image-upload-container">
            <!-- 移动端上传按钮 -->
            <div
              class="mobile-upload-btn"
              @click="handleMobileUpload(dialogProblemData.questionId)"
            >
              <i class="el-icon-plus"></i>
              <div class="upload-text">添加图片</div>
            </div>

            <!-- 图片列表水平滚动 -->
            <div class="image-scroll-container">
              <div class="image-list-horizontal">
                <div
                  v-for="(
                    image, imgIndex
                  ) in dialogProblemData.confirmImageList"
                  :key="imgIndex"
                  class="image-item"
                  @click="handleConfirmPictureCardPreview(image)"
                >
                  <img
                    :src="image.url"
                    :alt="image.name"
                    class="uploaded-image"
                  />
                  <div class="image-actions">
                    <i
                      class="el-icon-delete"
                      v-if="!customDisable(dialogProblemData)"
                      @click.stop="
                        removeSingleConfirmImage(dialogProblemData, imgIndex)
                      "
                    >
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 确认人 -->
      <div class="problem-row">
        <span style="color: #409eff" class="problem-label">确认人：</span>
        <el-input
          disabled
          v-model="dialogProblemData.confirmBy"
          class="problem-input"
        >
        </el-input>
      </div>
      <div class="fixed-action-buttons">
        <el-button
          type="primary"
          @click="handleCloseDialog('ConfirmQuestion')"
          class="save-btn"
          >保存并返回
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import keyboardMixin from "@/utils/keyboardMixin";

export default {
  name: "HomeView",
  mixins: [keyboardMixin],
  components: {},
  data() {
    return {
      // 判断是否是手机
      isApp: false,
      isCollapsed: true,
      searchTimer: null, // 防抖定时器
      currentWorkstation: "",
      currentOrder: "",
      monthlySequence: "",
      frameNumber: "",
      modelCode: "",

      // 新增数据
      tableMaxHeight: 300,
      inspectionList: [],
      problemList: [],

      // 图片上传相关
      dialogImageUrl: "",
      dialogVisible: false,

      // 图片预览缩放相关
      previewScale: 1,
      previewTranslateX: 0,
      previewTranslateY: 0,
      startTouchDistance: 0,
      startTouchScale: 1,

      // 新增：存储查询返回的原始数据
      originalData: {
        workStation: "",
        wipOrderNo: "",
        productNo: "",
        monthSequence: "",
        vin: "",
        dispositionItem: [],
        questionItem: [],
      },

      // 单项操作
      dialogTestData: {},
      dialogTestVisible: false,
      dialogProblemData: {},
      dialogProblemVisible: false,
      dialogIndex: -1,

      showIsConfirm: "0",
      // 责任班组选项
      respTeamOptions: [],
    };
  },
  mounted() {
    this.isApp = this.isAppEnvironment();
    // 获取责任班组选项
    window.getRespTeam((res) => {
      this.respTeamOptions = res;
    });

    // 设置表格最大高度为屏幕的1/3
    this.setTableMaxHeight();
    window.addEventListener("resize", this.setTableMaxHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setTableMaxHeight);
    // 清理防抖定时器
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
  },
  computed: {
    // 计算单据状态
    documentStatus() {
      return this.originalData.orderStatus === 3 ? "已关闭" : "检验中";
    },

    // 计算检验结果
    inspectionResult() {
      return this.problemList.every((item) => item.isClose === 1)
        ? "合格"
        : "不合格";
    },

    // 过滤后的检验项列表
    filteredInspectionList() {
      if (this.showIsConfirm === "0") {
        // 显示未关闭的项目（排除 testAttribute 为 'OK' 的项目）
        return this.inspectionList.filter(
          (inspection) =>
            inspection.isClose !== 1 && inspection.testAttribute !== "OK"
        );
      } else {
        // 显示已关闭的项目
        return this.inspectionList.filter(
          (inspection) =>
            inspection.isClose === 1 || inspection.testAttribute === "OK"
        );
      }
    },

    // 过滤后的问题列表
    filteredProblemList() {
      if (this.showIsConfirm === "0") {
        // 显示未关闭的问题
        return this.problemList.filter((problem) => problem.isClose !== 1);
      } else {
        // 显示已关闭的问题
        return this.problemList.filter((problem) => problem.isClose === 1);
      }
    },

    // 图片预览样式计算属性
    previewImageStyle() {
      return {
        transform: `scale(${this.previewScale}) translate(${this.previewTranslateX}px, ${this.previewTranslateY}px)`,
        transition: this.isTransitioning ? "transform 0.2s ease" : "none",
      };
    },
  },
  methods: {
    handleCloseDialog(type) {
      let saveData = {};
      if (type === "ConfirmInspection") {
        this.dialogTestVisible = false;
        saveData = {
          flag: type,
          id: this.dialogTestData.dispositionId,
          isConfirm: this.dialogTestData.isClose,
          confirmReMark: this.dialogTestData.confirmReMark,
        };
        console.log("确认检验项请求：", JSON.parse(JSON.stringify(saveData)));
        // 保存数据
        window.InspectionOnlineSingleSave(saveData, (res) => {
          console.log("确认检验项响应：", JSON.parse(JSON.stringify(res)));
          this.inspectionList.find(
            (item) => item.dispositionId === saveData.id
          ).confirmBy = res.confirmBy;
        });
      } else if (type === "ConfirmQuestion") {
        this.dialogProblemVisible = false;
        saveData = {
          flag: type,
          id: this.dialogProblemData.questionId,
          isConfirm: this.dialogProblemData.isClose,
          confirmReMark: this.dialogProblemData.confirmReMark,
          confirmImg: this.dialogProblemData.confirmImgs,
        };
        console.log("确认问题项请求：", JSON.parse(JSON.stringify(saveData)));
        // 保存数据
        window.InspectionOnlineSingleSave(saveData, (res) => {
          console.log("确认问题项响应：", JSON.parse(JSON.stringify(res)));
          this.problemList.find(
            (item) => item.questionId === saveData.id
          ).confirmBy = res.confirmBy;
        });
      }
    },
    handleOpenDialog(item, index, type) {
      this.dialogIndex = index;
      if (type === "inspection") {
        this.dialogTestData = item;
        // 避免图片预览被覆盖
        this.dialogTestVisible = this.dialogVisible !== true;
      } else if (type === "problem") {
        this.dialogProblemData = item;
        // 避免图片预览被覆盖
        this.dialogProblemVisible = this.dialogVisible !== true;
      }
    },
    customDisable(item) {
      return (
        this.originalData.orderStatus === 3 ||
        item.isHandle !== 1 ||
        (item.confirmBy !== window.Operator && item.confirmBy !== "")
      );
    },
    // 扫码
    onCamera(type) {
      window.parent.OpenCamera &&
        window.parent.OpenCamera((res) => {
          if (res.code == 200) {
            this.currentOrder = "";
            this.monthlySequence = "";
            this.frameNumber = "";
            if (type === "wipOrderNo") {
              this.currentOrder = res.data;
              this.handleOrderSearch();
            } else if (type === "vin") {
              this.frameNumber = res.data;
              this.handleFrameNumberSearch();
            } else if (type === "monthSequence") {
              this.monthlySequence = res.data;
              this.handleMonthlySequenceSearch();
            } else {
              console.log("未定义的扫码类型：", type);
            }
          }
        });
    },
    isAppEnvironment() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return (
        /iPad|iPhone|iPod/.test(userAgent) || // iOS devices
        /Android/.test(userAgent)
      );
    },
    // 查询检验项和问题
    getData(value) {
      console.log("查询检验项和问题请求：", JSON.parse(JSON.stringify(value)));
      window.dataItem(value, (data) => {
        console.log("查询检验项和问题响应：", JSON.parse(JSON.stringify(data)));
        if (data.code === "0") {
          // 保存原始数据
          this.originalData = { ...data };
          // 剔除code和msg
          delete this.originalData.code;
          delete this.originalData.msg;

          // 更新界面数据
          this.updateUIWithData(data);
          this.$message({
            message: "查询成功",
            type: "success",
            duration: 500,
            showClose: true,
          });
        } else {
          this.$message({
            message: data.msg || "查询失败",
            type: "error",
            duration: 500,
            showClose: true,
          });
        }
      });
    },
    // 使用查询返回的数据更新界面
    updateUIWithData(data) {
      // 更新输入框数据
      this.currentOrder = data.wipOrderNo || "";
      this.monthlySequence = data.monthSequence || "";
      this.frameNumber = data.vin || "";
      this.modelCode = data.productNo || "";

      // 更新检验项目表格数据
      this.inspectionList = (data.dispositionItem || []).map((item, index) => {
        let testAttribute = item.testAttribute === "OK" ? "OK" : "NG";

        // 解析文件
        const fileNames = item.fileNames ? item.fileNames.split(",") : [];
        const filePaths = item.filePaths ? item.filePaths.split(",") : [];
        const fileList = fileNames
          .map((name, idx) => ({
            name: name.trim(),
            path: filePaths[idx] ? filePaths[idx].trim() : "",
          }))
          .filter((f) => f.name && f.path);

        return {
          ...item,
          index: index + 1,
          inspectionItem: item.dispositionDesc,
          testAttribute: testAttribute,
          pushStatus: 0,
          fileList: fileList,
        };
      });

      // 更新问题描述数据
      this.problemList = (data.questionItem || []).map((item) => {
        // 处理检验图片URL，将字符串分割为数组
        const imageUrls = item.imgs
          ? item.imgs.split(",").filter((url) => url.trim() !== "")
          : [];
        const imageList = imageUrls.map((url) => ({
          name: url.split("/").pop(),
          url: url,
        }));

        // 处理复检图片URL
        const handImageUrls = item.handImgs
          ? item.handImgs.split(",").filter((url) => url.trim() !== "")
          : [];
        const handImageList = handImageUrls.map((url) => ({
          name: url.split("/").pop(),
          url: url,
        }));

        // 处理确认图片URL
        const confirmImageUrls = item.confirmImgs
          ? item.confirmImgs.split(",").filter((url) => url.trim() !== "")
          : [];
        const confirmImageList = confirmImageUrls.map((url) => ({
          name: url.split("/").pop(),
          url: url,
        }));

        return {
          ...item,
          imageList: imageList,
          handImageList: handImageList,
          confirmImageList: confirmImageList,
          // 确保isHandle是数字类型
          isHandle: item.isHandle ? Number(item.isHandle) : 0,
          // 确保isClose是数字类型
          isClose: item.isClose ? Number(item.isClose) : 0,
          pushStatus: 0,
          respTeam: item.respTeam || "",
          respEmployee: item.respEmployee || "",
        };
      });
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    // 构建查询参数
    buildQueryParams(type) {
      return {
        wipOrderNo: type === "wipOrderNo" ? this.currentOrder : "",
        vin: type === "vin" ? this.frameNumber : "",
        monthSequence: type === "monthSequence" ? this.monthlySequence : "",
        workStation: "",
      };
    },
    // 处理订单搜索
    // 处理订单搜索
    handleOrderSearch() {
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 设置新的定时器（500ms后执行）
      this.searchTimer = setTimeout(() => {
        const params = this.buildQueryParams("wipOrderNo");
        this.getData(params);
      }, 500);
    },
    // 处理月顺序号搜索
    handleMonthlySequenceSearch() {
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 设置新的定时器（500ms后执行）
      this.searchTimer = setTimeout(() => {
        const params = this.buildQueryParams("monthSequence");
        this.getData(params);
      }, 500);
    },
    // 处理车架号搜索
    handleFrameNumberSearch() {
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 设置新的定时器（500ms后执行）
      this.searchTimer = setTimeout(() => {
        const params = this.buildQueryParams("vin");
        this.getData(params);
      }, 500);
    },
    // 处理检验项是否关闭变化
    handleInspectionIsCloseChange(inspection) {
      // 更新原始数据
      const originalInspection = this.originalData.dispositionItem.find(
        (p) => p.dispositionId === inspection.dispositionId
      );
      if (originalInspection) {
        originalInspection.isClose = inspection.isClose;
      }
    },
    // 处理问题是否关闭变化
    handleIsCloseChange(problem) {
      // 更新原始数据
      const originalProblem = this.originalData.questionItem.find(
        (p) => p.questionId === problem.questionId
      );
      if (originalProblem) {
        originalProblem.isClose = problem.isClose;
      }
    },
    // 设置表格最大高度
    setTableMaxHeight() {
      this.tableMaxHeight = window.innerHeight / 3;
    },
    // 图片压缩
    compressImage(file, maxWidth = 2048, maxHeight = 2048, quality = 0.9) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            // 计算压缩后的尺寸
            let width = img.width;
            let height = img.height;

            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width = Math.floor(width * ratio);
              height = Math.floor(height * ratio);
            }

            // 创建canvas进行压缩
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // 转为JPEG格式的base64
            const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
            console.log(
              "图片压缩请求：",
              JSON.parse(
                JSON.stringify({
                  原始尺寸: `${img.width}x${img.height}`,
                  压缩后尺寸: `${width}x${height}`,
                  压缩后大小: `${(compressedBase64.length / 1024).toFixed(
                    1
                  )}KB`,
                })
              )
            );
            resolve(compressedBase64);
          };
          img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
      });
    },
    // 上传单张确认图片
    async uploadSingleConfirmImage(base64Data, questionId) {
      return new Promise((resolve, reject) => {
        const params = {
          url: [base64Data],
          id: questionId,
          FilePicker: base64Data,
        };

        window.saveImgFils(params, (response) => {
          if (response.code === 0) {
            resolve(response.data);
          } else {
            reject(new Error(response.msg || "图片上传失败"));
          }
        });
      });
    },
    // 移除单张确认图片
    removeSingleConfirmImage(problem, imgIndex) {
      // 从确认图片列表中移除
      problem.confirmImageList.splice(imgIndex, 1);
      // 更新confirmImgs字段
      problem.confirmImgs = problem.confirmImageList
        .map((f) => f.url)
        .join(",");
      // 同步到原始数据
      this.syncProblemData();

      this.$message({
        type: "success",
        message: "删除成功!",
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleConfirmPictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除空检验项
    deleteInspection() {
      const emptyInspection = this.inspectionList.filter(
        (inspection) =>
          !inspection.dispositionDesc ||
          inspection.dispositionDesc.trim() === ""
      );
      if (emptyInspection.length > 0) {
        // 循环删除，调用window方法删除远程，过滤本地空检验项
        for (let i = 0; i < emptyInspection.length; i++) {
          const inspection = emptyInspection[i];
          const delParams = {
            flag: "DelInspection",
            dispositionId: inspection.dispositionId,
          };
          console.log(
            "删除空检验项请求：",
            JSON.parse(JSON.stringify(delParams))
          );
          // 调用后台删除接口
          window.inspectionDel(delParams, (res) => {
            console.log("删除空检验项响应：", JSON.parse(JSON.stringify(res)));
          });
        }
        // 从本地列表中过滤掉空检验项
        this.inspectionList = this.inspectionList.filter(
          (inspection) =>
            inspection.dispositionDesc &&
            inspection.dispositionDesc.trim() !== ""
        );
        // 同步到原始数据
        this.syncInspectionData();
      }
    },
    // 删除空问题
    deleteProblem() {
      const emptyProblem = this.problemList.filter(
        (problem) => !problem.question || problem.question.trim() === ""
      );
      if (emptyProblem.length > 0) {
        // 循环删除，调用window方法删除远程，过滤本地空问题
        for (let i = 0; i < emptyProblem.length; i++) {
          const problem = emptyProblem[i];
          const delParams = {
            flag: "DelQuestion",
            questionId: problem.questionId,
          };
          console.log(
            "删除空问题请求：",
            JSON.parse(JSON.stringify(delParams))
          );
          // 调用后台删除接口
          window.questionDel(delParams, (res) => {
            console.log("删除空问题响应：", JSON.parse(JSON.stringify(res)));
          });
        }
        // 从本地列表中过滤掉空问题
        this.problemList = this.problemList.filter(
          (problem) => problem.question && problem.question.trim() !== ""
        );
        // 同步到原始数据
        this.syncProblemData();
      }
    },
    // 保存
    async save() {
      this.deleteInspection();
      this.deleteProblem();
      try {
        // 数据同步
        this.syncProblemData();
        this.syncInspectionData();
        const saveData = {
          ...this.originalData,
          flag: "Confirm",
        };
        console.log("保存数据请求：", JSON.parse(JSON.stringify(saveData)));
        // 调用保存接口
        window.InspectionOnlineSaveAndSubmit(saveData, (response) => {
          console.log("保存数据响应：", JSON.parse(JSON.stringify(response)));
          if (response.code === "0") {
            this.$message({
              message: "保存成功",
              type: "success",
              duration: 500,
              showClose: true,
            });
          } else {
            this.$message({
              message: response.msg || "保存失败",
              type: "error",
              duration: 500,
              showClose: true,
            });
          }
        });
      } catch (error) {
        console.log("保存失败：", JSON.parse(JSON.stringify(error)));
        this.$message({
          message: "保存失败: " + error.message,
          type: "error",
        });
      }
    },
    // 获取未关闭的检验项序号
    getUnclosedInspectionIndexes() {
      const unclosedIndexes = [];
      for (let i = 0; i < this.inspectionList.length; i++) {
        const inspection = this.inspectionList[i];
        // 如果项目未关闭且不是OK项，则将其序号加入数组
        if (inspection.isClose !== 1 && inspection.testAttribute !== "OK") {
          unclosedIndexes.push(i + 1); // 序号从1开始
        }
      }
      return unclosedIndexes;
    },
    // 获取未关闭的问题项序号
    getUnclosedProblemIndexes() {
      const unclosedIndexes = [];
      for (let i = 0; i < this.problemList.length; i++) {
        const problem = this.problemList[i];
        // 如果项目未关闭，则将其序号加入数组
        if (problem.isClose !== 1) {
          unclosedIndexes.push(i + 1); // 序号从1开始
        }
      }
      return unclosedIndexes;
    },
    // 提交
    async submit() {
      this.deleteInspection();
      this.deleteProblem();
      const unclosedInspectionIndexes = this.getUnclosedInspectionIndexes();
      const unclosedProblemIndexes = this.getUnclosedProblemIndexes();

      if (
        unclosedInspectionIndexes.length > 0 ||
        unclosedProblemIndexes.length > 0
      ) {
        let message = "以下项目未关闭：";
        if (unclosedInspectionIndexes.length > 0) {
          message += ` 检验项[${unclosedInspectionIndexes.join(",")}];`;
        }
        if (unclosedProblemIndexes.length > 0) {
          message += ` 问题项[${unclosedProblemIndexes.join(",")}];`;
        }
        this.$message({
          message: message,
          type: "warning",
          duration: 5000,
          showClose: true,
        });
        return;
      }
      this.$confirm("是否确认提交?（将无法再修改！）", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        customClass: "my-message-box", // 添加自定义类名
      })
        .then(() => {
          this.submitData();
        })
        .catch(() => {});
    },
    // 提交数据
    submitData() {
      try {
        // 确保问题数据同步
        this.syncProblemData();
        this.syncInspectionData();
        const submitData = {
          ...this.originalData,
          flag: "ConfirmSubmit",
        };
        console.log("提交数据请求：", JSON.parse(JSON.stringify(submitData)));
        // 调用保存接口
        window.InspectionOnlineSaveAndSubmit(submitData, (response) => {
          console.log("提交数据响应：", JSON.parse(JSON.stringify(response)));
          if (response.code === "0") {
            this.originalData = {};
            this.problemList = [];
            this.inspectionList = [];
            this.frameNumber = "";
            this.monthlySequence = "";
            this.modelCode = "";
            this.currentOrder = "";
            this.$message({
              message: "提交成功",
              type: "success",
              duration: 500,
              showClose: true,
            });
          } else {
            this.$message({
              message: response.msg || "提交失败",
              type: "error",
              duration: 500,
              showClose: true,
            });
          }
        });
      } catch (error) {
        console.log("提交失败：", JSON.parse(JSON.stringify(error)));
        this.$message({
          message: "提交失败: " + error.message,
          type: "error",
        });
      }
    },
    syncInspectionData() {
      this.originalData.dispositionItem = this.inspectionList.map(
        (inspection) => {
          // 查找原始数据中是否已存在该问题
          const originalInspection =
            this.originalData.dispositionItem?.find(
              (p) => p.dispositionId === inspection.dispositionId
            ) || {};
          return {
            ...originalInspection,
            dispositionId: inspection.dispositionId,
            dispositionDesc: inspection.dispositionDesc,
            dxDesc: inspection.dxDesc,
            testAttribute: inspection.testAttribute,
            handImgs: inspection.handImgs,
            handImageList: inspection.handImageList,
            confirmImgs: inspection.confirmImgs,
            confirmImageList: inspection.confirmImageList,
            testBy: inspection.testBy,
            isHandle: inspection.isHandle,
            handleReMark: inspection.handleReMark,
            handleBy: inspection.handleBy,
            isClose: inspection.isClose,
            confirmReMark: inspection.confirmReMark,
            confirmBy: inspection.confirmBy,
          };
        }
      );
    },
    syncProblemData() {
      this.originalData.questionItem = this.problemList.map((problem) => {
        // 查找原始数据中是否已存在该问题
        const originalProblem =
          this.originalData.questionItem?.find(
            (p) => p.questionId === problem.questionId
          ) || {};
        return {
          ...originalProblem,
          questionId: problem.questionId,
          question: problem.question,
          imgs: problem.imgs,
          imageList: problem.imageList,
          handImgs: problem.handImgs,
          handImageList: problem.handImageList,
          confirmImgs: problem.confirmImgs,
          confirmImageList: problem.confirmImageList,
          testBy: problem.testBy,
          isHandle: problem.isHandle,
          handleReMark: problem.handleReMark,
          handleBy: problem.handleBy,
          isClose: problem.isClose,
          confirmReMark: problem.confirmReMark,
          confirmBy: problem.confirmBy,
        };
      });
    },
    // 移动端图片上传处理
    handleMobileUpload(questionId) {
      // 创建两个文件输入元素
      const fileInputCamera = document.createElement("input");
      fileInputCamera.type = "file";
      fileInputCamera.accept = "image/*";
      fileInputCamera.capture = "environment"; // 强制使用相机
      fileInputCamera.style.position = "fixed";
      fileInputCamera.style.zIndex = "9999";

      const fileInputGallery = document.createElement("input");
      fileInputGallery.type = "file";
      fileInputGallery.accept = "image/*";
      fileInputGallery.multiple = true;
      fileInputGallery.style.position = "fixed";
      fileInputGallery.style.zIndex = "9999";
      const imgLength =
        this.problemList
          .find((problem) => problem.questionId === questionId)
          ?.confirmImgs?.split(",") || [];

      // 显示选择对话框
      this.$msgbox({
        title: "上传图片",
        message: "请选择图片来源",
        showCancelButton: true,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
        confirmButtonText: "拍照",
        cancelButtonText: "从相册选择",
        customClass: "my-message-box",
      })
        .then(() => {
          // 用户选择拍照
          fileInputCamera.onchange = async (event) => {
            const files = Array.from(event.target.files);
            if (files.length + imgLength.length > 30) {
              this.$message.warning(
                `最多只能上传30张图片，您已经选择了${imgLength.length}张，这次选择了${files.length}张`
              );
              return;
            }
            await this.processSelectedFiles(files, questionId);
          };
          fileInputCamera.click();
        })
        .catch(() => {
          // 用户选择从相册选择
          fileInputGallery.onchange = async (event) => {
            const files = Array.from(event.target.files);
            if (files.length + imgLength.length > 30) {
              this.$message.warning(
                `最多只能上传30张图片，您已经选择了${imgLength.length}张，这次选择了${files.length}张`
              );
              return;
            }
            await this.processSelectedFiles(files, questionId);
          };
          fileInputGallery.click();
        });
    },
    // 处理选中的文件
    async processSelectedFiles(files, questionId) {
      const problem = this.problemList.find((p) => p.questionId === questionId);
      if (!problem) return;
      this.$message.info("正在上传图片，请稍候...");
      try {
        // 处理每个选中的文件
        for (const file of files) {
          // 转换为base64
          const base64Data = await this.compressImage(file);
          // 上传图片
          const serverUrl = await this.uploadSingleConfirmImage(
            base64Data,
            questionId
          );
          // 创建图片对象并添加到列表
          const newImage = {
            name: file.name,
            url: serverUrl,
            raw: file,
          };
          problem.confirmImageList.push(newImage);
        }
        problem.confirmImgs = problem.confirmImageList
          .map((f) => f.url)
          .join(",");
        // 同步到原始数据
        this.syncProblemData();
        this.$message.success("图片上传成功");
      } catch (error) {
        console.log("图片上传失败：", JSON.parse(JSON.stringify(error)));
        this.$message.error("图片上传失败: " + error.message);
      }
    },
    // 图片预览缩放相关方法
    zoomIn() {
      this.previewScale *= 1.2;
    },
    zoomOut() {
      this.previewScale /= 1.2;
      if (this.previewScale < 0.1) {
        this.previewScale = 0.1;
      }
    },
    handleWheel(event) {
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    },
    resetPreviewTransform() {
      this.previewScale = 1;
      this.previewTranslateX = 0;
      this.previewTranslateY = 0;
    },
    fitPreviewImage() {
      this.resetPreviewTransform();
      this.$nextTick(() => {
        const image = this.$refs.previewImage;
        if (image && image.offsetWidth > 0 && image.offsetHeight > 0) {
          const scaleX = window.innerWidth / image.offsetWidth;
          const scaleY = window.innerHeight / image.offsetHeight;
          this.previewScale = Math.min(scaleX, scaleY);
        }
      });
    },
    onImageLoad() {
      this.fitPreviewImage();
    },
    // 触摸事件处理
    handleTouchStart(event) {
      if (event.touches.length === 2) {
        // 双指触摸，准备缩放
        this.startTouchDistance = this.getTouchDistance(event.touches);
        this.startTouchScale = this.previewScale;
      }
    },
    handleTouchMove(event) {
      if (event.touches.length === 2) {
        // 双指移动，执行缩放
        event.preventDefault();
        const currentDistance = this.getTouchDistance(event.touches);
        this.previewScale =
          this.startTouchScale * (currentDistance / this.startTouchDistance);

        // 限制缩放范围
        if (this.previewScale < 0.1) {
          this.previewScale = 0.1;
        } else if (this.previewScale > 10) {
          this.previewScale = 10;
        }
      }
    },
    handleTouchEnd() {
      // 重置触摸距离
      this.startTouchDistance = 0;
    },
    // 计算双指间距离
    getTouchDistance(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    // 根据文件类型返回不同图标
    getFileIcon(fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      const iconMap = {
        pdf: "el-icon-document",
        doc: "el-icon-document",
        docx: "el-icon-document",
        xls: "el-icon-s-grid",
        xlsx: "el-icon-s-grid",
        jpg: "el-icon-picture",
        jpeg: "el-icon-picture",
        png: "el-icon-picture",
        gif: "el-icon-picture",
      };
      return iconMap[ext] || "el-icon-document";
    },
    // 判断是否为PDF文件
    isPdfFile(fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      return ext === "pdf";
    },
    // 判断是否为图片文件
    isImageFile(fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
    },
    // 文件预览/下载
    handleFilePreview(file) {
      if (!file.path) {
        this.$message.warning("文件路径不存在");
        return;
      }
      window.open(file.path, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.dl-conclusion {
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;

  &.OK {
    color: #67c23a;
    background-color: #f0f9eb;
  }

  &.NG {
    color: #f56c6c;
    background-color: #fef0f0;
  }
}

.home {
  min-height: 100vh;
  overflow-y: auto;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 80px;
  box-sizing: border-box;
}

.collapse-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.fixed-section {
  padding: 15px 5px;
  border-bottom: 1px solid #eaeaea;
  background: white;
}

.fixed-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
}

.workstation-info {
  .label {
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .value {
    font-size: 16px;
    font-weight: 500;
    color: #303133;
    cursor: pointer;

    &:hover {
      color: #409eff;
      text-decoration: underline;
    }
  }

  .placeholder {
    font-size: 14px;
    color: #c0c4cc;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }
}

.order-input {
  width: 350px;
}

.toggle-icon {
  position: absolute;
  left: 50%;
  bottom: -18px;
  margin-left: -18px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f7fa;
  color: #0a0a0a;
  cursor: pointer;

  &:hover {
    background: #e4e7ed;
  }
}

.collapsible-section {
  padding: 15px;
  background: white;
}

.collapsible-content {
  display: flex;
  margin-bottom: 20px;
  gap: 15px;
}

.model-code-section {
  flex: 1;

  .section-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .model-code {
    font-size: 16px;
    color: #303133;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .no-data {
    font-size: 14px;
    color: #c0c4cc;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    text-align: center;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.input-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-row {
  display: flex;
  flex-direction: column;

  .input-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 6px;
  }

  .input-field {
    width: 100%;
  }
}

.special-config-section {
  .section-title {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .special-config {
    font-size: 16px;
    color: #303133;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
  }

  .no-data {
    font-size: 14px;
    color: #c0c4cc;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    text-align: center;
  }
}

/* 展开/折叠动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

/* 新增样式 */
.inspection-container {
  width: 100%;
  max-width: 1080px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 20px;
}

.document-status {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-top: 3px;

  .status-item {
    .status-label {
      font-size: 14px;
      color: #606266;
    }

    .status-value {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
    }
  }
}

.inspection-table-container {
  margin-bottom: 15px;

  .inspection-table {
    width: 100%;
  }
}

.problem-section {
  margin-bottom: 15px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .add-btn {
      // padding: 6px 12px;
      background: #409eff !important;
      color: #ffff !important;
    }
  }

  .problem-list {
    .problem-item {
      border: 1px solid #eaeaea;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 10px;

      .problem-content {
        .problem-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;

          .problem-label {
            width: 80px;
            font-size: 14px;
            color: #606266;
            line-height: 32px;
            flex-shrink: 0;
          }

          .problem-input {
            flex: 1;
            margin-right: 10px;
          }

          .remove-btn {
            flex-shrink: 0;
            background: #f56c6c !important;
            color: #fff !important;
          }

          .image-display-section {
            flex: 1;

            .image-display-container {
              .image-list-horizontal {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;

                .image-item {
                  position: relative;
                  width: 80px;
                  height: 80px;
                  flex-shrink: 0;
                  border-radius: 6px;
                  overflow: hidden;
                  border: 1px solid #eaeaea;
                  cursor: pointer;
                  transition: all 0.3s;

                  &:hover {
                    border-color: #409eff;
                  }

                  .displayed-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
              }
            }
          }

          .image-upload-section {
            flex: 1;
            position: relative;

            .image-upload-container {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              width: 100%;

              /* 上传按钮样式 */
              .image-uploader {
                flex-shrink: 0;

                ::v-deep .el-upload--picture-card {
                  width: 80px;
                  height: 80px;
                  line-height: 80px;
                  border-radius: 6px;
                  border: 1px dashed #d9d9d9;
                  background-color: #fafafa;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  &:hover {
                    border-color: #409eff;
                  }

                  i {
                    font-size: 20px;
                    color: #8c939d;
                  }
                }

                /* 隐藏默认的图片列表 */
                ::v-deep .el-upload-list--picture-card {
                  display: none;
                }
              }

              /* 图片横向滚动容器 */
              .image-scroll-container {
                flex: 1;
                width: 100px;
                overflow-x: auto;
                overflow-y: hidden;
                padding-bottom: 5px;

                .image-list-horizontal {
                  display: flex;
                  gap: 10px;
                  width: max-content;
                  min-height: 82px;

                  .image-item {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    flex-shrink: 0;
                    border-radius: 6px;
                    overflow: hidden;
                    border: 1px solid #eaeaea;
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                      border-color: #409eff;

                      .image-actions {
                        opacity: 1;
                      }
                    }

                    .uploaded-image {
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    }

                    .image-actions {
                      position: absolute;
                      top: 0;
                      right: 0;
                      background: rgba(0, 0, 0, 0.7);
                      border-radius: 0 0 0 6px;
                      padding: 2px;
                      opacity: 0;
                      transition: opacity 0.3s;

                      i {
                        color: white;
                        font-size: 14px;
                        padding: 2px;

                        &:hover {
                          color: #f56c6c;
                        }
                      }
                    }
                  }
                }
              }
            }

            .image-count {
              position: absolute;
              bottom: 5px;
              right: 5px;
              background: rgba(0, 0, 0, 0.5);
              color: white;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.problem-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;

  .problem-label {
    width: 80px;
    font-size: 14px;
    color: #606266;
    line-height: 32px;
    flex-shrink: 0;
  }

  .problem-input {
    flex: 1;
    margin-right: 10px;
  }

  .remove-btn {
    flex-shrink: 0;
    background: #f56c6c !important;
    color: #fff !important;
  }

  .push-btn {
    flex-shrink: 0;
    background: #409eff !important;
    color: #fff !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    margin-left: 5px !important;
  }

  .push-btn.is-disabled {
    flex-shrink: 0;
    background: #787878 !important;
    color: #fff !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    margin-left: 5px !important;
  }

  .image-display-section {
    flex: 1;

    .image-display-container {
      .image-list-horizontal {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        .image-item {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #eaeaea;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: #409eff;
          }

          .displayed-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }

  .image-upload-section {
    flex: 1;
    position: relative;

    .image-upload-container {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      width: 100%;

      /* 上传按钮样式 */
      .image-uploader {
        flex-shrink: 0;

        ::v-deep .el-upload--picture-card {
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 6px;
          border: 1px dashed #d9d9d9;
          background-color: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover {
            border-color: #409eff;
          }

          i {
            font-size: 20px;
            color: #8c939d;
          }
        }

        /* 隐藏默认的图片列表 */
        ::v-deep .el-upload-list--picture-card {
          display: none;
        }
      }

      /* 图片横向滚动容器 */
      .image-scroll-container {
        flex: 1;
        width: 100px;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 5px;

        .image-list-horizontal {
          display: flex;
          gap: 10px;
          width: max-content;
          min-height: 82px;

          .image-item {
            position: relative;
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #eaeaea;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              border-color: #409eff;

              .image-actions {
                opacity: 1;
              }
            }

            .uploaded-image {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .image-actions {
              position: absolute;
              top: 0;
              right: 0;
              background: rgba(0, 0, 0, 0.7);
              border-radius: 0 0 0 6px;
              padding: 2px;
              opacity: 0;
              transition: opacity 0.3s;

              i {
                color: white;
                font-size: 14px;
                padding: 2px;

                &:hover {
                  color: #f56c6c;
                }
              }
            }
          }
        }
      }
    }

    .image-count {
      position: absolute;
      bottom: 5px;
      right: 5px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 12px;
    }
  }
}

/* 移动端上传按钮样式 */
.mobile-upload-btn {
  width: 80px;
  height: 80px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    border-color: #409eff;
  }

  i {
    font-size: 20px;
    color: #8c939d;
    margin-bottom: 5px;
  }

  .upload-text {
    font-size: 12px;
    color: #8c939d;
  }
}

/* 横向滚动条样式 */
.image-scroll-container::-webkit-scrollbar {
  height: 6px;
}

.image-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.image-scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.image-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 底部固定按钮 - 修改为居中显示单个按钮 */
.fixed-action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 15px 0;
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .save-btn,
  .submit-btn {
    width: 100%;
    font-size: 16px;
  }

  .save-btn {
    background: #409eff !important;
    color: #fff !important;
  }

  .submit-btn {
    background: #67c23a !important;
    color: #fff !important;
  }
}

/* Element UI 输入框样式调整 */
::v-deep .el-input__inner {
  border-radius: 6px;
}

::v-deep .el-input__prefix {
  display: flex;
  align-items: center;
}

/* 表格样式调整 */
::v-deep .inspection-table .el-table__header-wrapper th {
  background-color: #f5f7fa;
  color: #606266;
  font-weight: 500;
  padding: 8px 0;
}

/* 图片预览样式 */
.image-preview-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  transform-origin: center center;
}

.image-preview-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 20px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
  }
}

::v-deep .inspection-table .el-table__body tr:hover > td {
  background-color: #f5f7fa;
}

/* 单选框组样式调整 */
.radio-group-container {
  display: flex;
  justify-content: flex-start;
}

::v-deep .el-radio-group {
  display: flex;
  white-space: nowrap;
  padding-top: 8px;
}

::v-deep .el-radio {
  margin-right: 8px;
}

/* 确保表格不出现水平滚动条 */
::v-deep .inspection-table .el-table {
  width: 100% !important;
}

::v-deep .inspection-table .el-table__body-wrapper {
  overflow-x: hidden;
}

/* 调整表格列宽，使检验项目更宽 */
::v-deep .inspection-table .el-table__header th:nth-child(2) {
  min-width: 220px;
}

/* 工位选择对话框样式调整 */
.dialog-footer {
  text-align: right;
  padding-top: 20px;
}

/* 文件列表样式 */
.file-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .file-item {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: #f5f7fa;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;

    i {
      margin-right: 6px;
      color: #409eff;
    }

    .file-name {
      font-size: 14px;
      color: #606266;
    }

    &:hover {
      background: #e6f7ff;

      .file-name {
        color: #409eff;
      }
    }
  }
}
</style>
